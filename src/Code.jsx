import { Fragment } from 'react'
import { highlightJsx } from './highlight.js'

/**
 * 글 안의 `...`를 코드 조각으로 그린다. 백틱을 글자로 보이면 입문자가 백틱까지 따라 친다.
 * 백틱 밖의 글은 renderText로 넘겨 레슨 링크 같은 처리를 더할 수 있다.
 */
export function InlineCode({ text, renderText = (t) => t }) {
  return text.split(/`([^`]+)`/).map((chunk, i) =>
    i % 2 ? (
      <code className="inline-code" key={i}>
        {chunk}
      </code>
    ) : (
      <Fragment key={i}>{renderText(chunk)}</Fragment>
    ),
  )
}

/** 실행하지 않는 코드 블록. 편집기와 같은 색으로 보인다. 내용은 레슨 데이터(작성자 글)이고 Prism이 이스케이프한다. */
export default function Code({ code }) {
  return (
    <pre className="code-static">
      <code dangerouslySetInnerHTML={{ __html: highlightJsx(code) }} />
    </pre>
  )
}
