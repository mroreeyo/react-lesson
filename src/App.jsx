import { useEffect, useState } from 'react'
import Lesson from './Lesson.jsx'
import LessonRail from './LessonRail.jsx'
import Playground from './Playground.jsx'
import { chapterOf, lessons } from './lessons/index.js'
import { KEYS, clearProgress, load, save } from './storage.js'

// 실험실 탭은 데모 3종과 함께 붙는다.
const TABS = [
  { id: 'lessons', label: '레슨' },
  { id: 'playground', label: '플레이그라운드' },
]

export default function App() {
  const [last] = useState(() => load(KEYS.last, {}))
  const [tab, setTab] = useState(() => (TABS.some((t) => t.id === last.tab) ? last.tab : 'lessons'))
  const [lessonId, setLessonId] = useState(() =>
    lessons.some((l) => l.id === last.lessonId) ? last.lessonId : lessons[0]?.id,
  )
  const [progress, setProgress] = useState(() => load(KEYS.progress, []))
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    save(KEYS.last, { tab, lessonId })
  }, [tab, lessonId])

  useEffect(() => {
    save(KEYS.progress, progress)
  }, [progress])

  const lesson = lessons.find((l) => l.id === lessonId)
  const pct = lessons.length ? Math.round((progress.length / lessons.length) * 100) : 0

  const complete = (id) => setProgress((prev) => (prev.includes(id) ? prev : [...prev, id]))
  const goto = (id) => {
    setLessonId(id)
    setDrawerOpen(false)
    window.scrollTo({ top: 0 })
  }

  return (
    <>
      <header className="app-head">
        <h1>React Lab</h1>
        <nav className="tabs" aria-label="화면 전환">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`tab${tab === t.id ? ' is-active' : ''}`}
              aria-current={tab === t.id ? 'page' : undefined}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>
        <div className="progress" title={`${progress.length}/${lessons.length} 레슨 완료`}>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${pct}%` }} />
          </div>
          <span className="progress-text">
            {progress.length}/{lessons.length}
          </span>
          <button
            className="ghost"
            disabled={progress.length === 0}
            onClick={() => {
              clearProgress()
              setProgress([])
            }}
          >
            초기화
          </button>
        </div>
      </header>

      {tab === 'lessons' ? (
        <div className="lessons-layout">
          <aside className={`rail-slot${drawerOpen ? ' is-open' : ''}`}>
            <LessonRail currentId={lessonId} progress={progress} onPick={goto} />
          </aside>

          <main className="app-body">
            {lesson ? (
              <>
                <button
                  className="drawer-toggle"
                  aria-expanded={drawerOpen}
                  onClick={() => setDrawerOpen((v) => !v)}
                >
                  챕터 {lesson.chapter}. {chapterOf(lesson.chapter)?.title} · {lesson.title}
                </button>
                <Lesson
                  lesson={lesson}
                  done={progress.includes(lesson.id)}
                  onComplete={complete}
                  onNavigate={goto}
                />
              </>
            ) : (
              <p className="panel-hint">레슨이 없습니다.</p>
            )}
          </main>
        </div>
      ) : (
        <main className="app-body">
          <Playground />
        </main>
      )}
    </>
  )
}
