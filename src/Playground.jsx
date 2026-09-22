import { useCallback, useState } from 'react'
import CodeSandbox from './CodeSandbox.jsx'
import { KEYS, load, save } from './storage.js'

const DEFAULT_CODE = `function App() {
  const [items, setItems] = useState(['리액트 훑어보기'])
  const [draft, setDraft] = useState('')

  return (
    <div>
      <h3>할 일 {items.length}개</h3>
      <input value={draft} onChange={(e) => setDraft(e.target.value)} />
      <button
        onClick={() => {
          if (!draft.trim()) return
          setItems([...items, draft])
          setDraft('')
        }}
      >
        추가
      </button>
      <ul>
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  )
}
`

export default function Playground() {
  const [initialCode] = useState(() => load(KEYS.playground, DEFAULT_CODE))
  const persist = useCallback((code) => save(KEYS.playground, code), [])

  return (
    <div className="tab-body">
      <header className="body-head">
        <h2>플레이그라운드</h2>
        <p className="tagline">레슨과 분리된 빈 편집기. 마지막 코드가 기기에 남는다.</p>
      </header>
      <CodeSandbox initialCode={initialCode} resetCode={DEFAULT_CODE} onCodeChange={persist} />
    </div>
  )
}
