import Prism from 'prismjs'
import 'prismjs/components/prism-jsx'

// 페이지 로드 시 문서 전체를 훑는 자동 하이라이트는 끈다. 우리는 함수로만 부른다.
Prism.manual = true

/** JSX 코드를 색 토큰이 붙은 HTML 문자열로 바꾼다. Prism이 텍스트를 이스케이프한다. */
export function highlightJsx(code) {
  return Prism.highlight(code, Prism.languages.jsx, 'jsx')
}
