// node src/runner.check.mjs — 실행 엔진의 세 가지 갈래를 확인한다.
import assert from 'node:assert/strict'
import { CodeError, compileToApp, injectedHookNames } from './runner.js'

async function expectError(code, stage) {
  try {
    await compileToApp(code)
  } catch (err) {
    assert.ok(err instanceof CodeError, `CodeError가 아님: ${err}`)
    assert.equal(err.stage, stage, `stage 불일치: ${err.stage}`)
    return err
  }
  assert.fail(`오류가 나야 하는데 통과함: ${code}`)
}

// 1. 훅을 쓰는 JSX가 App을 돌려준다
const App = await compileToApp('function App() { const [n] = useState(1); return <p>{n}</p> }')
assert.equal(typeof App, 'function')

// 2. 문법 오류
await expectError('function App() { return <p> }', 'compile')

// 3. App 미정의
const missing = await expectError('const x = 1', 'run')
assert.match(missing.message, /App/)

// 4. 모듈 최상위 예외도 실행 단계에서 잡힌다
await expectError('throw new Error("boom"); function App() {}', 'run')

// 19 훅이 주입 목록에 들어 있다
for (const hook of ['use', 'useActionState', 'useOptimistic', 'useState', 'useEffectEvent']) {
  assert.ok(injectedHookNames.includes(hook), `주입 누락: ${hook}`)
}

// 훅이 아니어도 커리큘럼이 쓰는 것은 바로 써야 한다 (레슨 23·24 Context, 33 memo, 34 ref prop)
await compileToApp('const C = createContext(null); const M = memo(() => null); function App() { return null }')
await compileToApp('function App() { const v = useContext(createContext(1)); return <p>{v}</p> }')

// 오류 문구: 원문을 "무엇이 잘못됐고 무엇을 고치면 되는지"로 바꾼다
const { hintFor } = await import('./errorHints.js')
const closing = await expectError('function App() { return <p>hi</p }', 'compile')
assert.match(hintFor(closing.message) ?? '', /닫히지 않았다/)
const adjacent = await expectError('function App() { return <p>a</p><p>b</p> }', 'compile')
assert.match(hintFor(adjacent.message) ?? '', /하나로 감싸거나/)
const undef = await expectError('const x = foo; function App() { return null }', 'run')
assert.match(hintFor(undef.message) ?? '', /`foo`이\(가\) 정의되지 않았다/)
assert.match(hintFor('Objects are not valid as a React child (found: object with keys {a})') ?? '', /객체를 화면에/)
assert.match(hintFor('Too many re-renders. React limits the number of renders') ?? '', /렌더 중에 state/)
// 배포 빌드는 번호만 준다
assert.match(hintFor('Minified React error #31; visit https://react.dev/errors/31?args[]=object') ?? '', /객체를 화면에/)
assert.match(hintFor('Minified React error #310; visit https://react.dev/errors/310') ?? '', /훅을 부르는 순서/)
assert.match(hintFor('Minified React error #301; visit https://react.dev/errors/301') ?? '', /렌더 중에 state/)
assert.match(hintFor('Minified React error #130; visit https://react.dev/errors/130?args[]=undefined') ?? '', /undefined가 왔다/)
assert.match(hintFor('Minified React error #321; visit https://react.dev/errors/321') ?? '', /함수 밖에서 훅/)
assert.equal(hintFor('Minified React error #3100; visit'), null) // 경계: 310에 안 걸려야 한다
assert.equal(hintFor('완전히 모르는 오류'), null)
assert.equal(hintFor(''), null)

// 저장소는 신뢰 경계다. 깨진 값이 들어 있어도 기본값으로 부팅해야 한다.
const store = new Map()
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
}
const { KEYS, load, save } = await import('./storage.js')
save(KEYS.progress, ['a'])
assert.deepEqual(load(KEYS.progress, []), ['a'])
for (const bad of ['"oops"', 'null', '5', '{}', '{bro', '']) {
  store.set(KEYS.progress, bad)
  assert.deepEqual(load(KEYS.progress, []), [], `깨진 progress ${bad}`)
  store.set(KEYS.last, bad === '{}' ? '[]' : bad)
  assert.deepEqual(load(KEYS.last, {}), {}, `깨진 last ${bad}`)
}
store.set(KEYS.playground, 'function App() {}')
assert.equal(load(KEYS.playground, 'x'), 'function App() {}')

// ── 콘솔 모드 (JS 기초 트랙)
const { formatValue, runConsole } = await import('./consoleRunner.js')
// 값 표기: 맨 바깥 문자열만 따옴표 없이, 묶음 안에서는 따옴표로 5와 '5'를 가른다
assert.equal(formatValue('장보기'), '장보기')
assert.equal(formatValue([5, '5']), "[5, '5']")
assert.equal(formatValue({ id: 1, title: '장보기', done: false }), "{ id: 1, title: '장보기', done: false }")
assert.equal(formatValue({ 'my key': 1 }), "{ 'my key': 1 }")
assert.equal(formatValue([undefined, null]), '[undefined, null]')
assert.equal(formatValue(function greet() {}), '함수 greet')
assert.equal(formatValue([]), '[]')
const loop = { name: 'a' }
loop.self = loop
assert.equal(formatValue(loop), "{ name: 'a', self: [순환] }")
const shared = { a: 1 }
assert.equal(formatValue([shared, shared]), '[{ a: 1 }, { a: 1 }]') // 두 번 넣은 것은 순환이 아니다
assert.equal(
  formatValue([{ id: 1, title: '장보기', done: false }, { id: 2, title: '설거지', done: true }]),
  "[\n  { id: 1, title: '장보기', done: false },\n  { id: 2, title: '설거지', done: true }\n]",
)

const collect = async (code) => {
  const out = []
  const run = await runConsole(code, (line) => out.push(line))
  return { out, ...run }
}
const texts = (out) => out.map((l) => l.text)

// 여러 인자는 공백으로 잇고, warn·error는 수준이 붙는다
{
  const { out, error, dispose } = await collect("console.log('할 일:', 3, [1]); console.warn('w'); console.error('e')")
  dispose()
  assert.equal(error, null)
  assert.deepEqual(texts(out), ['할 일: 3 [1]', 'w', 'e'])
  assert.deepEqual(out.map((l) => l.level), ['log', 'warn', 'error'])
}
// 문법 오류와 실행 오류. 실행 오류 전에 찍힌 줄은 남는다
{
  const { error } = await collect('console.log(')
  assert.equal(error.stage, 'compile')
  const jsx = await collect('const a = <p />')
  assert.equal(jsx.error.stage, 'compile') // JS 트랙에서 JSX는 문법 오류다
  const run = await collect("console.log('앞'); const t = 1; t = 2")
  assert.equal(run.error.stage, 'run')
  assert.deepEqual(texts(run.out), ['앞'])
  assert.match(hintFor(run.error.message, 'console') ?? '', /let으로 선언한다/)
}
// 콘솔 모드에서는 리액트 전용 힌트가 나오지 않는다
assert.match(hintFor('Cannot read properties of undefined', 'react'), /ref라면/)
assert.doesNotMatch(hintFor('Cannot read properties of undefined', 'console'), /ref/)
assert.equal(hintFor('Too many re-renders', 'console'), null)
assert.match(hintFor("Identifier 'title' has already been declared. (3:6)", 'console') ?? '', /두 번 선언했다/)
// J2 레슨에서 나올 실수들. 힌트가 틀린 길로 보내지 않아야 한다
{
  const eq = await collect("const done = false\nif (done = true) console.log('끝')")
  assert.match(hintFor(eq.error.message, 'console'), /`===`/) // let으로 바꾸라고만 하면 틀린 코드가 조용히 돈다
  const json = await collect("JSON.parse('장보기')")
  assert.match(hintFor(json.error.message, 'console'), /JSON 모양이 아니다/) // 괄호 힌트로 새지 않는다
  const empty = await collect("JSON.parse('')")
  assert.match(hintFor(empty.error.message, 'console'), /JSON 모양이 아니다/)
  const destructure = await collect('const todos = []\nconst { title } = todos[0]')
  assert.match(hintFor(destructure.error.message, 'console'), /`todos\[0\]`이\(가\) undefined이라 그 안에서 `title`/)
  const topAwait = await collect('async function f() {}\nawait f()')
  assert.match(hintFor(topAwait.error.message, 'console'), /async를 붙인 함수 안에서만/)
  const noCatch = await collect("try {\n  console.log('a')\n}")
  assert.match(hintFor(noCatch.error.message, 'console'), /catch가 없다/)
}
// 입문자가 가장 흔히 내는 실수: 한글 글자에 따옴표를 빠뜨린다. \w는 한글을 못 잡으므로 따로 본다
{
  const { error } = await collect('console.log(장보기)')
  assert.match(hintFor(error.message, 'console') ?? '', /따옴표로 감싸 `'장보기'`/)
  const bad = await collect('console.log(')
  assert.doesNotMatch(bad.error.message, /console\.js/) // 학습자가 본 적 없는 파일 이름은 뗀다
}

const wait = (ms) => new Promise((r) => setTimeout(r, ms))
// 코드가 끝난 뒤 도착한 줄(Promise·타이머)에는 '나중'이 붙는다. 순서도 실제와 같다
{
  const { out, dispose } = await collect(
    "setTimeout(() => console.log('타이머'), 0); Promise.resolve().then(() => console.log('약속')); console.log('먼저')",
  )
  await wait(20)
  dispose()
  assert.deepEqual(texts(out), ['먼저', '약속', '타이머'])
  assert.deepEqual(out.map((l) => l.late), [false, true, true])
}
// dispose하면 이 실행의 타이머가 전부 멈춘다. 편집할 때 옛 타이머가 남지 않게 하는 장치다
{
  const { out, dispose } = await collect("setInterval(() => console.log('틱'), 5); setTimeout(() => console.log('늦게'), 30)")
  await wait(18)
  dispose()
  const seen = out.length
  assert.ok(seen >= 1, '인터벌이 돌지 않았다')
  await wait(40)
  assert.equal(out.length, seen, 'dispose 뒤에도 출력이 늘었다')
  assert.ok(!texts(out).includes('늦게'))
}
// 타이머 안에서 던진 오류는 오류 줄이 된다
{
  const { out, dispose } = await collect("setTimeout(() => { throw new Error('펑') }, 0)")
  await wait(10)
  dispose()
  assert.deepEqual(out.map((l) => [l.level, l.text]), [['error', 'Error: 펑']])
}
// 500줄을 넘으면 멈추고 한 줄로 알린다
{
  const { out, dispose } = await collect('for (let i = 0; i < 2000; i++) console.log(i)')
  dispose()
  assert.equal(out.length, 501)
  assert.match(out.at(-1).text, /너무 많아 멈췄다/)
}

console.log(`ok — 주입된 훅 ${injectedHookNames.length}개, 오류 문구 힌트, 저장소 방어, 콘솔 모드 확인`)
