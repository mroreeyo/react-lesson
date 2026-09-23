import { Component, Suspense, useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { hintFor } from './errorHints.js'

class RenderBoundary extends Component {
  state = { error: null }
  static getDerivedStateFromError(error) {
    return { error }
  }
  render() {
    if (this.state.error) {
      const message = this.state.error.message
      const hint = hintFor(message)
      return (
        <div className="panel-error">
          <strong>렌더 중 오류</strong>
          {hint && <p className="hint">{hint}</p>}
          <pre>{message}</pre>
        </div>
      )
    }
    return this.props.children
  }
}

/**
 * 사용자 App을 결과 패널 전용 root에 렌더한다.
 * - 앱 트리와 분리된 root이므로 사용자 코드가 앱 렌더링에 끼어들지 못한다.
 * - runKey가 바뀌면 오류 경계도 새로 마운트되어 이전 오류 상태가 초기화된다.
 * - use 훅은 Suspense 경계 안에서만 의미가 있으므로 기본으로 감싼다.
 */
export default function ResultPanel({ App, runKey }) {
  const hostRef = useRef(null)
  const rootRef = useRef(null)

  // 이벤트 핸들러나 비동기 코드에서 던진 오류는 오류 경계가 못 잡는다. 창에서 받아 화면에 보인다.
  // 결과 패널이 있는 동안 도는 사용자 코드가 그 출처다. 코드가 바뀌면(runKey) 지운다.
  const [asyncError, setAsyncError] = useState(null)
  useEffect(() => {
    setAsyncError(null)
  }, [App, runKey])
  useEffect(() => {
    if (!App) return
    const onError = (e) => {
      const message = e.error?.message ?? e.message
      if (message) setAsyncError(message)
    }
    const onReject = (e) => setAsyncError(e.reason?.message ?? String(e.reason))
    window.addEventListener('error', onError)
    window.addEventListener('unhandledrejection', onReject)
    return () => {
      window.removeEventListener('error', onError)
      window.removeEventListener('unhandledrejection', onReject)
    }
  }, [App])

  useEffect(() => {
    // StrictMode에서 effect가 두 번 돌아도 컨테이너당 root는 하나만 만든다.
    if (!rootRef.current) rootRef.current = createRoot(hostRef.current)
    const root = rootRef.current
    return () => {
      // 다른 root가 렌더 중일 때 동기 unmount하면 React가 경고하므로 한 틱 미룬다.
      setTimeout(() => {
        // ref가 비었으면 진짜 언마운트. StrictMode 재실행이면 ref가 그대로 남아 있다.
        if (!hostRef.current) {
          root.unmount()
          rootRef.current = null
        }
      })
    }
  }, [])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    root.render(
      App ? (
        <RenderBoundary key={runKey}>
          <Suspense fallback={<p className="panel-hint">불러오는 중…</p>}>
            <App />
          </Suspense>
        </RenderBoundary>
      ) : null,
    )
  }, [App, runKey])

  return (
    <>
      {asyncError && (
        <div className="panel-error">
          <strong>이벤트 처리 중 오류</strong>
          {hintFor(asyncError) && <p className="hint">{hintFor(asyncError)}</p>}
          <pre>{asyncError}</pre>
        </div>
      )}
      <div className="result-host" ref={hostRef} />
    </>
  )
}
