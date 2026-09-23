import { useEffect, useState } from 'react'
import { chapters, lessonsOf } from './lessons/index.js'

const firstSentence = (text) => (text ? `${text.split('\n\n')[0].split('. ')[0]}.` : '')

/** 챕터 6개로 접히는 목록. 접힌 상태에서는 챕터 도입 문장이 한 줄 요약으로 보인다. */
export default function LessonRail({ currentId, progress, onPick }) {
  const currentChapterId = chapters.find((c) => lessonsOf(c.id).some((l) => l.id === currentId))?.id
  const [open, setOpen] = useState(() => new Set([currentChapterId ?? '0']))

  // 이전/다음으로 챕터 경계를 넘으면 새 챕터를 펼쳐 현재 레슨이 목록에 보이게 한다.
  useEffect(() => {
    if (!currentChapterId) return
    setOpen((prev) => (prev.has(currentChapterId) ? prev : new Set(prev).add(currentChapterId)))
  }, [currentChapterId])

  const toggle = (id) =>
    setOpen((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  return (
    <nav className="rail" aria-label="레슨 목록">
      {chapters.map((chapter) => {
        const items = lessonsOf(chapter.id)
        const doneCount = items.filter((l) => progress.includes(l.id)).length
        const isOpen = open.has(chapter.id)

        return (
          <section className="rail-chapter" key={chapter.id}>
            <button
              className="rail-chapter-head"
              aria-expanded={isOpen}
              onClick={() => toggle(chapter.id)}
            >
              <span className="rail-chapter-title">
                {chapter.id}. {chapter.title}
              </span>
              <span className="rail-count">
                {items.length > 0 ? `${doneCount}/${items.length}` : '준비 중'}
              </span>
            </button>

            {isOpen ? (
              items.length > 0 ? (
                <ul className="rail-list">
                  {items.map((lesson) => (
                    <li key={lesson.id}>
                      <button
                        className={`rail-item${lesson.id === currentId ? ' is-current' : ''}`}
                        aria-current={lesson.id === currentId ? 'true' : undefined}
                        onClick={() => onPick(lesson.id)}
                      >
                        <span className="rail-num">{lesson.order}</span>
                        <span className="rail-item-title">{lesson.title}</span>
                        {progress.includes(lesson.id) && (
                          <span className="rail-done" aria-label="완료">
                            ✓
                          </span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="rail-empty">아직 레슨이 없습니다.</p>
              )
            ) : (
              chapter.intro && <p className="rail-summary">{firstSentence(chapter.intro)}</p>
            )}
          </section>
        )
      })}
    </nav>
  )
}
