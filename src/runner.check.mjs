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

console.log(`ok — 주입된 훅 ${injectedHookNames.length}개, 오류 문구 힌트, 저장소 방어 확인`)
