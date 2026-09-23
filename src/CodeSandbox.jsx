import { useEffect, useRef, useState } from 'react'
import { hintFor } from './errorHints.js'
import ResultPanel from './ResultPanel.jsx'
import { CodeError, compileToApp, injectedHookNames, loadBabel } from './runner.js'

/**
 * 편집기와 결과 패널 한 쌍. 레슨의 '지금 방식' 블록과 플레이그라운드가 같이 쓴다.
 * 코드 상태를 직접 들고 있으므로, 레슨을 넘길 때는 key로 갈아 초기 코드를 되돌린다.
 */
export default function CodeSandbox({ initialCode, resetCode = initialCode, onCodeChange }) {
  const [code, setCode] = useState(initialCode)
  const [App, setApp] = useState(null)
  const [error, setError] = useState(null)
  const [ready, setReady] = useState(false)
  const runIdRef = useRef(0)
  const [runKey, setRunKey] = useState(0)
  // 코드를 안 고치고 처음부터 다시 돌릴 때 올린다. 결과 패널의 key에 섞여 App이 새로 마운트된다.
  const [rerun, setRerun] = useState(0)

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

  useEffect(() => {
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
  }, [code])

  const dirty = code !== resetCode

  return (
    <div className="sandbox">
      <section className="pane">
        <header className="pane-head">
          <h3>편집기</h3>
          <button className="ghost" onClick={() => setCode(resetCode)} disabled={!dirty}>
            원래 코드로
          </button>
        </header>
        <p className="notice">
          `App` 컴포넌트를 정의하세요. import는 쓸 수 없고, useState 같은 함수는 바로 쓰면 됩니다.
        </p>
        <textarea
          className="editor"
          spellCheck={false}
          value={code}
          disabled={!ready}
          aria-label="예제 코드 편집기"
          onChange={(e) => setCode(e.target.value)}
        />
        {!ready && <p className="panel-hint">변환기를 불러오는 중…</p>}
        <p className="warn">
          종료 조건 없는 반복문은 이 탭을 멈춥니다. 저장한 코드는 남지만 새로고침해야 합니다.
        </p>
        <details className="hooks">
          <summary>바로 쓸 수 있는 함수 {injectedHookNames.length}개</summary>
          <code>{injectedHookNames.join(', ')}</code>
        </details>
      </section>

      <section className="pane">
        <header className="pane-head">
          <h3>결과</h3>
          <button className="ghost" onClick={() => setRerun((n) => n + 1)} disabled={!App}>
            다시 실행
          </button>
        </header>
        {error && (
          <div className="panel-error">
            <strong>{error.stage === 'compile' ? '문법 오류' : '실행 오류'}</strong>
            {hintFor(error.message) && <p className="hint">{hintFor(error.message)}</p>}
            <pre>{error.message}</pre>
          </div>
        )}
        <ResultPanel App={App} runKey={`${runKey}-${rerun}`} />
      </section>
    </div>
  )
}
