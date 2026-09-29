// 확인 문제 보기를 보여 줄 순서. 레슨 데이터는 정답이 거의 늘 둘째 자리라, 그대로 두면 "가운데를 고르면 된다"가 된다.
// 문제 글로 섞으므로 같은 문제는 언제 열어도 같은 순서다. 돌려주는 값은 원래 보기 번호의 배열이다.
export function quizOrder(question, count) {
  let h = 2166136261
  for (const ch of question) h = Math.imul(h ^ ch.codePointAt(0), 16777619) >>> 0
  const order = [...Array(count).keys()]
  for (let i = count - 1; i > 0; i--) {
    h = Math.imul(h ^ (h >>> 15), 2246822507) >>> 0
    const j = h % (i + 1)
    ;[order[i], order[j]] = [order[j], order[i]]
  }
  return order
}
