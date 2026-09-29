import { useEffect, useId, useRef, useState } from 'react'
import Code, { InlineCode } from './Code.jsx'
import CodeEditor from './CodeEditor.jsx'
import { collectOutput, runConsole, sameOutput } from './consoleRunner.js'
import { hintFor } from './errorHints.js'
import ResultPanel from './ResultPanel.jsx'
import { CodeError, compileToApp, injectedHookNames, loadBabel } from './runner.js'

/**
 * 편집기와 결과 패널 한 쌍. 레슨의 '지금 방식' 블록과 플레이그라운드가 같이 쓴다.
 * 코드 상태를 직접 들고 있으므로, 레슨을 넘길 때는 key로 갈아 초기 코드를 되돌린다.
 * mode 'console'은 JS 기초 트랙용이다. App 없이 코드 전체를 돌리고 결과 자리에 콘솔 출력을 쌓는다.
 */
export default function CodeSandbox({
  initialCode,
  resetCode = initialCode,
  solutionCode,
  onCodeChange,
  mode = 'react',
  label = '예제 코드 편집기',
  outputUnchanged = false,
}) {
  const isConsole = mode === 'console'
  const editorId = useId()
  const [code, setCode] = useState(initialCode)
  const [App, setApp] = useState(null)
  const [error, setError] = useState(null)
  const [ready, setReady] = useState(false)
  const runIdRef = useRef(0)
  const [runKey, setRunKey] = useState(0)
  // 코드를 안 고치고 처음부터 다시 돌릴 때 올린다. 결과 패널의 key에 섞여 App이 새로 마운트된다.
  const [rerun, setRerun] = useState(0)
  const [lines, setLines] = useState([])
  // '다시 실행'은 기다리지 않고 바로 돌린다. 편집은 600ms 쉬었다가 돌린다.
  const runNowRef = useRef(false)
  // 콘솔은 높이가 정해져 있다. 새 줄이 오면 맨 아래로 따라가, '나중'에 온 줄이 가려지지 않게 한다.
  const consoleRef = useRef(null)
  useEffect(() => {
    const el = consoleRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [lines])

  // 편집기가 처음 보일 때 Babel 청크를 미리 받기 시작한다.
  useEffect(() => {
    loadBabel().then(
      () => setReady(true),
      (err) =>
        setError({
          stage: 'compile',
          message: `변환기를 받지 못했다. 네트워크를 확인하고 새로고침한다. (${err.message})`,
        }),
    )
  }, [])

  useEffect(() => {
    onCodeChange?.(code)
  }, [code, onCodeChange])

  // 콘솔 모드: 정답 코드를 뒤에서 한 번 돌려 출력을 받아 둔다. 학습자 출력이 이것과 같아지면 알려 준다.
  // 코드를 채점하지 않고 출력만 견준다. 고쳐 쓰기만 해서 출력이 처음과 같은 레슨(outputUnchanged)은 알리지 않는다.
  const [expected, setExpected] = useState(null)
  useEffect(() => {
    if (!isConsole || !solutionCode) return
    let alive = true
    collectOutput(solutionCode).then((sol) => {
      if (alive && !sol.error) setExpected({ lines: sol.lines })
    })
    return () => {
      alive = false
    }
  }, [isConsole, solutionCode])

  useEffect(() => {
    if (isConsole) return
    const timer = setTimeout(async () => {
      const runId = ++runIdRef.current
      try {
        const next = await compileToApp(code)
        if (runId !== runIdRef.current) return
        setError(null)
        setApp(() => next)
        setRunKey(runId)
      } catch (err) {
        if (runId !== runIdRef.current) return
        setError({
          stage: err instanceof CodeError ? err.stage : 'compile',
          message: err.message,
        })
        setApp(null) // 오류가 나면 직전 정상 화면은 지운다.
      }
    }, 600)
    return () => clearTimeout(timer)
  }, [code, isConsole])

  // 콘솔 모드. 코드가 바뀌거나 다시 실행하면 이전 실행의 타이머를 먼저 정리한다(cleanup의 dispose).
  // 레슨을 떠날 때도 같은 cleanup이 돌아 타이머가 남지 않는다.
  useEffect(() => {
    if (!isConsole) return
    let cancelled = false
    let run = null
    const delay = runNowRef.current ? 0 : 600
    runNowRef.current = false
    const timer = setTimeout(async () => {
      setLines([])
      const result = await runConsole(code, (line) => {
        if (!cancelled) setLines((prev) => [...prev, line])
      })
      if (cancelled) return result.dispose()
      run = result
      setError(result.error)
    }, delay)
    return () => {
      cancelled = true
      clearTimeout(timer)
      run?.dispose()
    }
  }, [code, rerun, isConsole])

  const dirty = code !== resetCode
  // 학습자가 친 코드를 덮어쓰기 전에 묻는다. 스타터 그대로이거나 이미 정답이면 잃을 것이 없다.
  const replaceWith = (next) => {
    if (code === resetCode || code === solutionCode || window.confirm('편집기에서 고친 코드가 사라집니다. 계속할까요?')) {
      setCode(next)
    }
  }

  const matched =
    expected && !outputUnchanged && !error && lines.length > 0 && sameOutput(lines, expected.lines)

  const hint = error && hintFor(error.message, mode)
  const errorBox = error && (
    <div className="panel-error">
      <strong>{error.stage === 'compile' ? '문법 오류' : '실행 오류'}</strong>
      {hint && (
        <p className="hint">
          <InlineCode text={hint} />
        </p>
      )}
      <pre>{error.message}</pre>
    </div>
  )

  return (
    <div className="sandbox">
      <section className="pane">
        <header className="pane-head">
          <h3>편집기</h3>
          <button className="ghost" onClick={() => replaceWith(resetCode)} disabled={!dirty}>
            원래 코드로
          </button>
        </header>
        <p className="notice">
          {isConsole
            ? '코드는 위에서 아래로 실행되고, console.log로 찍은 것이 콘솔에 쌓입니다.'
            : '`App` 컴포넌트를 정의하세요. import는 쓸 수 없고, useState 같은 함수는 바로 쓰면 됩니다.'}{' '}
          Tab은 들여쓰기이고, 키보드로 편집기를 나가려면 Esc 다음 Tab입니다.
        </p>
        <CodeEditor
          id={editorId}
          label={label}
          value={code}
          disabled={!ready}
          onChange={setCode}
        />
        {!ready && <p className="panel-hint">변환기를 불러오는 중…</p>}
        <p className="warn">
          종료 조건 없는 반복문은 이 탭을 멈춥니다. 저장한 코드는 남지만 새로고침해야 합니다.
        </p>
        {!isConsole && (
          <details className="hooks">
            <summary>바로 쓸 수 있는 함수 {injectedHookNames.length}개</summary>
            <code>{injectedHookNames.join(', ')}</code>
          </details>
        )}
        {solutionCode && (
          // 모를 때 펼친다. 맞는지는 앱이 판단하지 않는다. 결과 화면과 이 코드를 보고 스스로 본다.
          <details className="solution">
            <summary>정답 코드 보기</summary>
            <p className="panel-hint">
              {!isConsole
                ? '막히면 펼친다. 맞았는지는 결과 화면과 이 코드를 견주어 스스로 본다.'
                : outputUnchanged
                  ? '막히면 펼친다. 이 레슨은 고쳐 쓰기만 하므로 출력이 처음과 같다. 코드를 이 정답과 견주어 본다.'
                  : '막히면 펼친다. 콘솔 출력이 정답의 출력과 같아지면 콘솔 아래에 표시가 뜬다.'}
            </p>
            <Code code={solutionCode} />
            {isConsole && expected && (
              <>
                <p className="panel-hint">정답을 실행하면 콘솔에 이렇게 찍힌다.</p>
                <pre className="expected-output">{expected.lines.map((line) => line.text).join('\n')}</pre>
              </>
            )}
            <button className="ghost" onClick={() => replaceWith(solutionCode)} disabled={code === solutionCode}>
              편집기에 넣기
            </button>
          </details>
        )}
      </section>

      <section className="pane">
        <header className="pane-head">
          <h3>{isConsole ? '콘솔' : '결과'}</h3>
          <button
            className="ghost"
            onClick={() => {
              runNowRef.current = true
              setRerun((n) => n + 1)
            }}
            disabled={isConsole ? !ready : !App}
          >
            다시 실행
          </button>
        </header>
        {/* 콘솔 모드에서는 오류 전에 찍힌 줄이 먼저다. 오류 상자를 출력 아래에 둔다. */}
        {!isConsole && errorBox}
        {isConsole ? (
          // 스크롤되는 영역이라 키보드로도 닿게 tabIndex를 준다
          <div className="console" role="log" aria-label="콘솔 출력" tabIndex={0} ref={consoleRef}>
            {lines.length === 0 && <p className="panel-hint">{error ? '오류 전에 찍힌 줄이 없습니다.' : '아직 출력이 없습니다.'}</p>}
            {lines.map((line, i) => (
              <div key={i} className={`console-line is-${line.level}`}>
                {/* 코드가 끝까지 돈 뒤 타이머·Promise에서 온 줄. 무엇이 먼저 찍히는지 보게 한다. */}
                {line.late && <span className="console-late">나중</span>}
                <pre>{line.text}</pre>
              </div>
            ))}
          </div>
        ) : (
          <ResultPanel App={App} runKey={`${runKey}-${rerun}`} />
        )}
        {isConsole && errorBox}
        {matched && (
          <p className="match" role="status">
            ✓ 정답 코드와 출력이 같다.
          </p>
        )}
      </section>
    </div>
  )
}
