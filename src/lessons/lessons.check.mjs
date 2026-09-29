// node src/lessons/lessons.check.mjs — 레슨 데이터가 PRD 데이터 모델을 지키는지 본다.
// 레슨이 39개까지 늘어나도 조용히 깨지지 않게 하는 게 목적이다.
import assert from 'node:assert/strict'
import { readdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { collectOutput, sameOutput } from '../consoleRunner.js'
import { compileToApp } from '../runner.js'

const here = dirname(fileURLToPath(import.meta.url))
const all = await readdir(here)
const files = all.filter((f) => /^chapter-\d+\.js$/.test(f)).sort()
const jsFiles = all.filter((f) => /^js-chapter-[A-D]\.js$/.test(f)).sort()
assert.ok(files.length > 0, 'chapter-*.js 가 없다')
assert.ok(jsFiles.length > 0, 'js-chapter-*.js 가 없다')

const importAll = async (names) =>
  (await Promise.all(names.map((f) => import(pathToFileURL(join(here, f)).href)))).flatMap((m) => m.default)
const lessons = await importAll(files)
const jsLessons = await importAll(jsFiles)

// index.js는 import.meta.glob을 쓰므로 node에서 읽을 수 없다. 챕터 id만 여기 적는다.
const chapterIds = new Set(['0', '1', '2', '3', '4', '5'])
const jsChapterIds = new Set(['A', 'B', 'C', 'D'])

// id는 두 트랙을 통틀어 겹치면 안 된다. 진행도와 초안이 id로 저장된다.
const seenIds = new Set()
const seenOrders = { react: new Set(), js: new Set() }

for (const l of [...lessons, ...jsLessons]) {
  const isJs = jsLessons.includes(l)
  const at = `${isJs ? 'JS' : '레슨'} ${l.order} ${l.title}`

  assert.ok(l.id && !seenIds.has(l.id), `${at}: id가 없거나 중복이다`)
  seenIds.add(l.id)

  const orders = seenOrders[isJs ? 'js' : 'react']
  assert.ok(Number.isInteger(l.order) && !orders.has(l.order), `${at}: order가 없거나 중복이다`)
  orders.add(l.order)

  assert.ok((isJs ? jsChapterIds : chapterIds).has(l.chapter), `${at}: 없는 챕터 ${l.chapter}`)
  if (isJs) {
    assert.ok(l.id.startsWith('js-'), `${at}: JS 레슨 id는 js-로 시작한다`)
    // JS 레슨 끝의 "리액트에서 쓰는 곳" 링크가 실제 리액트 레슨을 가리켜야 한다
    for (const n of l.usedIn ?? []) {
      assert.ok(lessons.some((r) => r.order === n), `${at}: usedIn의 레슨 ${n}이 없다`)
    }
  } else {
    // 트랙 잇기: 리액트의 JS 되짚기와 관문 항목은 전부 실제 JS 레슨으로 이어져야 한다
    const jsIds = new Set(jsLessons.map((j) => j.id))
    for (const p of l.jsPrereq ?? []) {
      assert.ok(typeof p === 'object' && jsIds.has(p.js), `${at}: JS 되짚기 "${p.text ?? p}"가 JS 레슨에 이어지지 않았다`)
    }
    for (const it of l.items ?? []) {
      assert.ok(jsIds.has(it.js), `${at}: 점검 항목 "${it.title}"가 JS 레슨에 이어지지 않았다`)
    }
    // JS 트랙이 가르치지 않는 문법을 리액트 실행 코드가 쓰기 시작하면 여기서 잡힌다(보충 문서 '데이터 모델').
    // 없던 시절·읽기 전용 코드는 실행하지 않고 "안 읽어도 된다"고 안내하므로 대상이 아니다.
    const running = [l.starterCode, l.solutionCode].filter(Boolean).join('\n')
    const untaught = {
      '템플릿 문자열': /`/,
      '?.': /\?\./,
      '??': /\?\?/,
      'for 문': /\bfor \(/,
      var: /\bvar /,
      class: /\bclass \w/,
    }
    for (const [name, re] of Object.entries(untaught)) {
      assert.ok(!re.test(running), `${at}: JS 트랙에서 가르치지 않는 ${name}을(를) 쓴다. JS 레슨을 더하거나 코드를 바꾼다`)
    }
  }
  assert.ok(['practice', 'concept', 'checklist'].includes(l.kind), `${at}: kind가 이상하다`)

  // 항상 있는 블록
  assert.ok(l.definition, `${at}: 한 줄 정의가 없다`)
  assert.ok(l.quiz, `${at}: 확인 문제가 없다`)
  assert.equal(l.quiz.options.length, 3, `${at}: 3지선다가 아니다`)
  assert.ok(
    l.quiz.answerIndex >= 0 && l.quiz.answerIndex < 3,
    `${at}: answerIndex가 범위를 벗어났다`,
  )
  assert.ok(l.quiz.explanation, `${at}: 해설이 없다`)

  // kind별 '지금 방식'
  if (l.kind === 'practice' && !isJs) {
    assert.ok(l.starterCode?.includes('function App'), `${at}: starterCode에 App이 없다`)
  }
  if (l.kind === 'concept') {
    assert.ok(l.readOnly?.length > 0, `${at}: 읽기 전용 코드가 없다`)
    // PRD: 개념 레슨은 읽기 전용 코드와 그림
    assert.ok(l.figure?.steps?.length >= 2, `${at}: 개념 레슨에 그림(figure)이 없다`)
  }
  // PRD 리스크 표: 레슨마다 출처 링크를 단다
  assert.ok(l.sources?.length > 0, `${at}: 출처 링크가 없다`)
  if (l.kind === 'checklist') assert.ok(l.items?.length > 0, `${at}: 체크리스트 항목이 없다`)

  // '왜 나왔나'는 '없던 시절'이 있을 때만
  if (l.before) {
    assert.ok(l.before.text && l.before.code, `${at}: 없던 시절에 설명이나 코드가 빠졌다`)
    assert.ok(l.why?.length > 0, `${at}: 없던 시절만 있고 왜 나왔나가 없다`)
  } else {
    assert.ok(!l.why, `${at}: 없던 시절 없이 왜 나왔나만 있다`)
  }
}

// 실습 레슨의 예제는 수정 없이 실행돼야 한다. 실제로 변환·실행해 App을 받아 본다.
// before.code와 readOnly는 실행하지 않는 코드이므로 대상이 아니다.
const practice = lessons.filter((l) => l.kind === 'practice')
for (const l of practice) {
  const App = await compileToApp(l.starterCode).catch((err) => {
    assert.fail(`레슨 ${l.order} ${l.title}: starterCode가 실행되지 않는다 — [${err.stage}] ${err.message}`)
  })
  assert.equal(typeof App, 'function', `레슨 ${l.order} ${l.title}: App을 못 받았다`)

  // 스타터는 앞 레슨 방식으로 돌아가는 상태, 정답은 이 레슨의 완성본. 둘 다 실행돼야 하고 달라야 한다.
  if (l.solutionCode) {
    const Sol = await compileToApp(l.solutionCode).catch((err) => {
      assert.fail(`레슨 ${l.order} ${l.title}: solutionCode가 실행되지 않는다 — [${err.stage}] ${err.message}`)
    })
    assert.equal(typeof Sol, 'function', `레슨 ${l.order} ${l.title}: 정답의 App을 못 받았다`)
    assert.notEqual(l.solutionCode, l.starterCode, `레슨 ${l.order} ${l.title}: 스타터와 정답이 같다`)
  }
}
// JS 레슨은 콘솔 모드로 돌린다. 스타터와 정답 모두 오류 없이 한 줄 이상 찍어야 하고, 둘은 달라야 한다.
const jsPractice = jsLessons.filter((l) => l.kind === 'practice')
// 출력이 그대로인 레슨(구조 분해처럼 고쳐 쓰기만 하는 레슨)은 "정답과 출력이 같다" 표시를 켜지 않는다. 앱과 같은 판정을 여기서 센다.
const sameAsStarter = []
for (const l of jsPractice) {
  const outputs = {}
  for (const [name, code] of [['starterCode', l.starterCode], ['solutionCode', l.solutionCode]]) {
    assert.ok(code, `JS ${l.order} ${l.title}: ${name}가 없다`)
    // 타이머·Promise를 쓰는 레슨은 나중에 오는 줄까지 받는다. 그 안에서 난 오류도 여기서 잡힌다.
    const { lines, error } = await collectOutput(code)
    assert.equal(error, null, `JS ${l.order} ${l.title}: ${name}가 실행되지 않는다 — ${error?.stage} ${error?.message}`)
    assert.ok(lines.length > 0, `JS ${l.order} ${l.title}: ${name}가 아무것도 찍지 않는다`)
    assert.ok(!lines.some((line) => line.level === 'error'), `JS ${l.order} ${l.title}: ${name}가 오류 줄을 찍는다`)
    outputs[name] = lines
  }
  assert.notEqual(l.solutionCode, l.starterCode, `JS ${l.order} ${l.title}: 스타터와 정답이 같다`)
  // 앱은 outputUnchanged를 보고 표시를 끈다. 실제 출력과 어긋나면 표시가 처음부터 켜지거나, 영영 안 켜진다.
  const unchanged = sameOutput(outputs.starterCode, outputs.solutionCode)
  assert.equal(!!l.outputUnchanged, unchanged, `JS ${l.order} ${l.title}: outputUnchanged가 실제 출력과 맞지 않는다`)
  if (unchanged) sameAsStarter.push(l.order)

  // 챕터 끝의 "스스로 해보기": 목표로 보여 주는 출력(target)이 정답 코드의 실제 출력과 같아야 한다
  if (l.challenge) {
    const c = l.challenge
    assert.ok(c.goal && c.target && c.starterCode && c.solutionCode, `JS ${l.order}: 스스로 해보기에 빠진 칸이 있다`)
    const { lines, error } = await collectOutput(c.solutionCode)
    assert.equal(error, null, `JS ${l.order} 스스로 해보기: 정답이 실행되지 않는다 — ${error?.message}`)
    assert.equal(lines.map((line) => line.text).join('\n'), c.target, `JS ${l.order} 스스로 해보기: target이 정답 출력과 다르다`)
  }
}

// 용어 첫 등장(보충 문서 '쓰기 원칙'): JS 트랙 본문은 용어를 그것을 푸는 레슨보다 앞에서 쓰지 않는다.
// 본문 = 학습자가 반드시 읽는 곳(정의·할 일·코드 주석·확인 문제). 더 파고들면·없던 시절은 "JS N에서 본다"로 앞을 가리킬 수 있어 대상이 아니다.
const TERMS = [
  ['값', /(^|[^가-힣])값/, 2], ['문자열', /문자열/, 2], ['불리언', /불리언/, 2], ['변수', /변수/, 3],
  ['연산자', /연산자/, 4], ['속성', /속성/, 5], ['메서드', /메서드/, 5], ['표현식', /표현식/, 7],
  ['함수', /함수/, 8], ['매개변수', /매개변수/, 8], ['인자', /인자/, 8], ['배열', /배열/, 11],
  ['객체', /객체/, 12], ['구조 분해', /구조 분해/, 15], ['스프레드', /스프레드/, 16], ['JSON', /JSON/, 17],
  ['참조', /참조/, 18], ['클로저', /클로저/, 19], ['모듈', /모듈/, 21], ['타이머', /타이머/, 22],
  ['콜백', /콜백/, 23], ['Promise', /Promise/, 23], ['await', /\bawait\b/, 24],
]
// 리액트 용어는 JS 트랙 본문에 설명 없이 나오지 않는다. 리액트로 잇고 싶으면 "리액트 레슨 N"으로 가리킨다.
// state는 단어로만 본다. "statement(문)" 병기에 걸리지 않게 한다.
const REACT_TERMS = [/\bstate\b/, /렌더/, /컴포넌트/, /props/, /Effect/, /훅/, /JSX/]
const comments = (code) => (code ?? '').split('\n').map((line) => line.split('//')[1] ?? '').join('\n')
for (const l of jsLessons) {
  const body = [l.title, l.tagline, l.definition, ...[].concat(l.goal ?? []), comments(l.starterCode), comments(l.solutionCode),
    l.quiz.question, ...l.quiz.options, l.quiz.explanation, l.challenge?.goal ?? ''].join('\n')
  for (const [name, re, at] of TERMS) {
    assert.ok(!(l.order < at && re.test(body)), `JS ${l.order} ${l.title}: '${name}'을(를) JS ${at}에서 풀기 전에 쓴다`)
  }
  for (const re of REACT_TERMS) assert.ok(!re.test(body), `JS ${l.order} ${l.title}: 리액트 용어 ${re}를 설명 없이 쓴다`)
}

// 확인 문제의 정답이 화면에서 한 자리에 몰리지 않아야 한다. 몰리면 읽지 않고 자리로 맞힌다.
const { quizOrder } = await import('../quizOrder.js')
const shownAt = [0, 0, 0]
for (const l of [...lessons, ...jsLessons]) {
  const order = quizOrder(l.quiz.question, 3)
  assert.deepEqual([...order].sort(), [0, 1, 2], `${l.title}: 보기 순서가 순열이 아니다`)
  shownAt[order.indexOf(l.quiz.answerIndex)]++
}
const quizTotal = lessons.length + jsLessons.length
for (const n of shownAt) assert.ok(n >= quizTotal * 0.2, `정답이 보이는 자리가 한쪽으로 몰렸다: ${shownAt}`)

// 길이 단서: 정답만 유독 길거나(자세하거나) 유독 짧으면 읽지 않고 맞힌다. 보기 셋이면 우연히 그럴 확률이 1/3쯤이다.
const onlyOne = (pick) =>
  [...lessons, ...jsLessons].filter((l) => {
    const len = l.quiz.options.map((o) => o.length)
    const edge = pick(...len)
    return len[l.quiz.answerIndex] === edge && len.filter((x) => x === edge).length === 1
  }).length
const longest = onlyOne(Math.max)
const shortest = onlyOne(Math.min)
assert.ok(longest <= quizTotal * 0.35, `정답이 유일하게 가장 긴 보기인 문제가 ${longest}/${quizTotal}개다. 오답도 정답만큼 구체적으로 쓴다`)
assert.ok(shortest <= quizTotal * 0.35, `정답이 유일하게 가장 짧은 보기인 문제가 ${shortest}/${quizTotal}개다`)

// 영어 병기: 용어가 처음 풀리는 JS 레슨에 한 번, "한국어(영어" 모양으로 둔다. 에러 메시지와 검색은 영어로 만난다.
const GLOSS = [
  ['주석', 'comment', 1], ['값', 'value', 2], ['문자열', 'string', 2], ['숫자', 'number', 2], ['불리언', 'boolean', 2],
  ['변수', 'variable', 3], ['연산자', 'operator', 4], ['속성', 'property', 5], ['메서드', 'method', 5],
  ['표현식', 'expression', 7], ['문', 'statement', 7], ['함수', 'function', 8], ['호출', 'call', 8],
  ['인자', 'argument', 8], ['매개변수', 'parameter', 8], ['화살표 함수', 'arrow function', 9], ['배열', 'array', 11],
  ['객체', 'object', 12], ['키', 'key', 12], ['구조 분해', 'destructuring', 15], ['스프레드', 'spread', 16],
  ['얕은 복사', 'shallow copy', 16], ['참조', 'reference', 18], ['클로저', 'closure', 19], ['모듈', 'module', 21],
  ['콜백', 'callback', 23],
]
for (const [ko, en, at] of GLOSS) {
  const l = jsLessons.find((j) => j.order === at)
  assert.ok(JSON.stringify(l).includes(`${ko}(${en}`), `JS ${at}: '${ko}(${en})' 병기가 없다`)
}

const withSolution = practice.filter((l) => l.solutionCode).length
// 레슨 1(리액트 소개)만 완성본으로 시작한다. 나머지 실습은 전부 앞 레슨 방식 스타터 + 정답이어야 한다.
for (const l of practice) if (l.order !== 1) assert.ok(l.solutionCode, `레슨 ${l.order} ${l.title}: solutionCode가 없다`)

console.log(
  `ok — 레슨 ${lessons.length}개(실습 ${practice.length}개 실행 확인, 정답 코드 ${withSolution}개), 챕터 파일 ${files.length}개 · JS 레슨 ${jsLessons.length}개(콘솔 실행 확인 ${jsPractice.length}개, 출력이 그대로인 레슨 ${sameAsStarter.join(',') || '없음'}) · 정답 자리 ${shownAt.join('/')} · 길이 단서 긴 ${longest}·짧은 ${shortest} · 영어 병기 ${GLOSS.length}개`,
)
