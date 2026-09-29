import { useState } from 'react'
import { InlineCode } from './Code.jsx'
import { quizOrder } from './quizOrder.js'

/** 3지선다 1문제. 정답이면 레슨을 완료로 표시하고, 오답은 다시 고를 수 있다. */
export default function Quiz({ quiz, done, onCorrect, onNext, nextLabel }) {
  const [picked, setPicked] = useState(null)
  const correct = picked === quiz.answerIndex

  return (
    <section className="block quiz">
      <h3 className="block-head">확인 문제</h3>
      {/* 레슨 글처럼 `...`를 코드 조각으로 그린다. 백틱이 글자로 보이면 입문자가 따라 친다. */}
      <p className="quiz-q">
        <InlineCode text={quiz.question} />
      </p>
      <ul className="quiz-options">
        {quizOrder(quiz.question, quiz.options.length).map((i) => {
          const option = quiz.options[i]
          const chosen = picked === i
          return (
            <li key={i}>
              <button
                className={`quiz-option${chosen ? (correct ? ' is-correct' : ' is-wrong') : ''}`}
                aria-pressed={chosen}
                disabled={correct}
                onClick={() => {
                  setPicked(i)
                  if (i === quiz.answerIndex) onCorrect()
                }}
              >
                <InlineCode text={option} />
              </button>
            </li>
          )
        })}
      </ul>
      {picked !== null && (
        <p className={`quiz-verdict${correct ? ' is-correct' : ''}`} role="status">
          {correct ? <InlineCode text={`정답. ${quiz.explanation}`} /> : '틀렸다. 다시 고를 수 있다.'}
        </p>
      )}
      {/* 맞힌 자리에서 바로 넘어간다. 아래 이전/다음 버튼까지 내려갈 필요가 없다. */}
      {correct && onNext && (
        <button className="quiz-next" onClick={onNext}>
          다음 레슨 · {nextLabel} →
        </button>
      )}
      {done && picked === null && <p className="panel-hint">이미 푼 레슨이다.</p>}
    </section>
  )
}
