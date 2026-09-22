import { Component, Suspense, useEffect, useRef } from 'react'
import { createRoot } from 'react-dom/client'

class RenderBoundary extends Component {
  state = { error: null }
  static getDerivedStateFromError(error) {
    return { error }
  }
  render() {
    if (this.state.error) {
      return (
        <div className="panel-error">
          <strong>렌더 중 오류</strong>
          <pre>{this.state.error.message}</pre>
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

  return <div className="result-host" ref={hostRef} />
}
