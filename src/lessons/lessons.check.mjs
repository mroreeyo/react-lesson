// node src/lessons/lessons.check.mjs — 레슨 데이터가 PRD 데이터 모델을 지키는지 본다.
// 레슨이 39개까지 늘어나도 조용히 깨지지 않게 하는 게 목적이다.
import assert from 'node:assert/strict'
import { readdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { compileToApp } from '../runner.js'

const here = dirname(fileURLToPath(import.meta.url))
const files = (await readdir(here)).filter((f) => /^chapter-\d+\.js$/.test(f)).sort()
assert.ok(files.length > 0, 'chapter-*.js 가 없다')

const lessons = (
  await Promise.all(files.map((f) => import(pathToFileURL(join(here, f)).href)))
).flatMap((m) => m.default)

// index.js는 import.meta.glob을 쓰므로 node에서 읽을 수 없다. 챕터 id만 여기 적는다.
const chapterIds = new Set(['0', '1', '2', '3', '4', '5'])

const seenIds = new Set()
const seenOrders = new Set()

for (const l of lessons) {
  const at = `레슨 ${l.order} ${l.title}`

  assert.ok(l.id && !seenIds.has(l.id), `${at}: id가 없거나 중복이다`)
  seenIds.add(l.id)

  assert.ok(Number.isInteger(l.order) && !seenOrders.has(l.order), `${at}: order가 없거나 중복이다`)
  seenOrders.add(l.order)

  assert.ok(chapterIds.has(l.chapter), `${at}: 없는 챕터 ${l.chapter}`)
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
  if (l.kind === 'practice') {
    assert.ok(l.starterCode?.includes('function App'), `${at}: starterCode에 App이 없다`)
  }
  if (l.kind === 'concept') assert.ok(l.readOnly?.length > 0, `${at}: 읽기 전용 코드가 없다`)
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
}

console.log(
  `ok — 레슨 ${lessons.length}개(실습 ${practice.length}개 실행 확인), 챕터 파일 ${files.length}개`,
)
