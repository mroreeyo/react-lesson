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
for (const hook of ['use', 'useActionState', 'useOptimistic', 'useState']) {
  assert.ok(injectedHookNames.includes(hook), `주입 누락: ${hook}`)
}

console.log(`ok — 주입된 훅 ${injectedHookNames.length}개`)
