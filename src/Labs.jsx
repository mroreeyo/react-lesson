import { useEffect, useRef } from 'react'
import ResultPanel from './ResultPanel.jsx'
import { demos } from './labs/index.jsx'

/** 실험실 탭. 레슨에서 링크로 들어오면 해당 데모로 스크롤하고, 읽던 레슨으로 돌아갈 수 있다. */
export default function Labs({ focusId, onBack, backLabel }) {
  const focusRef = useRef(null)

  useEffect(() => {
    focusRef.current?.scrollIntoView({ block: 'start' })
  }, [focusId])

  return (
    <div className="tab-body">
      <header className="body-head">
        <h2>실험실</h2>
        <p className="tagline">코드가 아니라 동작을 본다. 눌러 보고 레슨으로 돌아가면 된다.</p>
        {onBack && (
          <button className="ghost" onClick={onBack}>
            ← {backLabel}
          </button>
        )}
      </header>

      {demos.map((demo) => (
        <section
          className={`demo${demo.id === focusId ? ' is-focused' : ''}`}
          key={demo.id}
          ref={demo.id === focusId ? focusRef : null}
        >
          <h3>{demo.title}</h3>
          <p className="demo-what">{demo.what}</p>
          {/* 결과 패널과 같은 별도 root. 앱의 StrictMode가 렌더 횟수를 두 배로 만들지 않게 한다. */}
          <ResultPanel App={demo.Component} runKey={demo.id} />
        </section>
      ))}
    </div>
  )
}
