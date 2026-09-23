import { highlightJsx } from './highlight.js'

/** 실행하지 않는 코드 블록. 편집기와 같은 색으로 보인다. 내용은 레슨 데이터(작성자 글)이고 Prism이 이스케이프한다. */
export default function Code({ code }) {
  return (
    <pre className="code-static">
      <code dangerouslySetInnerHTML={{ __html: highlightJsx(code) }} />
    </pre>
  )
}
