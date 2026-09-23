import Editor from 'react-simple-code-editor'
import { highlightJsx } from './highlight.js'

/**
 * 색이 입혀진 편집기. textarea 위에 하이라이트된 pre를 겹치는 방식이라 접근성은 textarea 그대로다.
 * Tab은 두 칸 들여쓰기, Shift+Tab은 내어쓰기, Enter는 앞 줄 들여쓰기를 잇는다.
 * 키보드로 편집기를 나가려면 Esc 다음 Tab이다.
 */
export default function CodeEditor({ id, value, onChange, disabled, label }) {
  return (
    <>
      <label className="sr-only" htmlFor={id}>
        {label}
      </label>
      <Editor
        className="editor"
        textareaId={id}
        textareaClassName="editor-textarea"
        preClassName="editor-pre"
        value={value}
        onValueChange={onChange}
        highlight={highlightJsx}
        tabSize={2}
        insertSpaces
        padding={14}
        disabled={disabled}
      />
    </>
  )
}
