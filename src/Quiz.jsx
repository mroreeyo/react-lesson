import { useState } from 'react'

/** 3지선다 1문제. 정답이면 레슨을 완료로 표시하고, 오답은 다시 고를 수 있다. */
export default function Quiz({ quiz, done, onCorrect }) {
  const [picked, setPicked] = useState(null)
  const correct = picked === quiz.answerIndex

  return (
    <section className="block quiz">
      <h3 className="block-head">확인 문제</h3>
      <p className="quiz-q">{quiz.question}</p>
      <ul className="quiz-options">
        {quiz.options.map((option, i) => {
          const chosen = picked === i
          return (
            <li key={i}>
              <button
                className={`quiz-option${chosen ? (correct ? ' is-correct' : ' is-wrong') : ''}`}
                aria-pressed={chosen}
                onClick={() => {
                  setPicked(i)
                  if (i === quiz.answerIndex) onCorrect()
                }}
              >
                {option}
              </button>
            </li>
          )
        })}
      </ul>
      {picked !== null && (
        <p className={`quiz-verdict${correct ? ' is-correct' : ''}`} role="status">
          {correct ? `정답. ${quiz.explanation}` : '아니다. 다시 골라 보세요.'}
        </p>
      )}
      {done && picked === null && <p className="panel-hint">이미 푼 레슨입니다.</p>}
    </section>
  )
}
