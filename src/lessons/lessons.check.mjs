// node src/lessons/lessons.check.mjs — 레슨 데이터가 PRD 데이터 모델을 지키는지 본다.
// 레슨이 39개까지 늘어나도 조용히 깨지지 않게 하는 게 목적이다.
import assert from 'node:assert/strict'
import { readdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { runConsole } from '../consoleRunner.js'
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
for (const l of jsPractice) {
  for (const [name, code] of [['starterCode', l.starterCode], ['solutionCode', l.solutionCode]]) {
    assert.ok(code, `JS ${l.order} ${l.title}: ${name}가 없다`)
    const out = []
    const { error, dispose } = await runConsole(code, (line) => out.push(line))
    dispose()
    assert.equal(error, null, `JS ${l.order} ${l.title}: ${name}가 실행되지 않는다 — ${error?.stage} ${error?.message}`)
    assert.ok(out.length > 0, `JS ${l.order} ${l.title}: ${name}가 아무것도 찍지 않는다`)
    assert.ok(!out.some((line) => line.level === 'error'), `JS ${l.order} ${l.title}: ${name}가 오류 줄을 찍는다`)
  }
  assert.notEqual(l.solutionCode, l.starterCode, `JS ${l.order} ${l.title}: 스타터와 정답이 같다`)
}

const withSolution = practice.filter((l) => l.solutionCode).length
// 레슨 1(리액트 소개)만 완성본으로 시작한다. 나머지 실습은 전부 앞 레슨 방식 스타터 + 정답이어야 한다.
for (const l of practice) if (l.order !== 1) assert.ok(l.solutionCode, `레슨 ${l.order} ${l.title}: solutionCode가 없다`)

console.log(
  `ok — 레슨 ${lessons.length}개(실습 ${practice.length}개 실행 확인, 정답 코드 ${withSolution}개), 챕터 파일 ${files.length}개 · JS 레슨 ${jsLessons.length}개(콘솔 실행 확인 ${jsPractice.length}개)`,
)
