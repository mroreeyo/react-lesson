import { useEffect, useState } from 'react'
import Labs from './Labs.jsx'
import Lesson from './Lesson.jsx'
import LessonRail from './LessonRail.jsx'
import Playground from './Playground.jsx'
import { chapterOf, lessons } from './lessons/index.js'
import { KEYS, clearProgress, load, save } from './storage.js'

const TABS = [
  { id: 'lessons', label: '레슨' },
  { id: 'labs', label: '실험실' },
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
  const [focusedDemo, setFocusedDemo] = useState(null)

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
  const openDemo = (demoId) => {
    setFocusedDemo(demoId)
    setTab('labs')
  }
  const backToLesson = () => {
    setFocusedDemo(null)
    setTab('lessons')
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
              onClick={() => {
                if (t.id !== 'labs') setFocusedDemo(null)
                setTab(t.id)
              }}
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
                {/* 레슨이 바뀌면 안의 state(확인 문제 선택, 펼친 블록)를 전부 새로 시작한다. 레슨 21의 그 key다. */}
                <Lesson
                  key={lesson.id}
                  lesson={lesson}
                  done={progress.includes(lesson.id)}
                  onComplete={complete}
                  onNavigate={goto}
                  onOpenDemo={openDemo}
                />
              </>
            ) : (
              <p className="panel-hint">레슨이 없습니다.</p>
            )}
          </main>
        </div>
      ) : tab === 'labs' ? (
        <main className="app-body">
          <Labs
            focusId={focusedDemo}
            onBack={focusedDemo && lesson ? backToLesson : null}
            backLabel={lesson ? `레슨으로 돌아가기 · ${lesson.order}. ${lesson.title}` : ''}
          />
        </main>
      ) : (
        <main className="app-body">
          <Playground />
        </main>
      )}
    </>
  )
}
