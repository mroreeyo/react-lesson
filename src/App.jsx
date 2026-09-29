import { useEffect, useState } from 'react'
import Labs from './Labs.jsx'
import Lesson from './Lesson.jsx'
import LessonRail from './LessonRail.jsx'
import Playground from './Playground.jsx'
import { chapterOf, chapters, isJsLesson, jsChapters, jsLessons, lessons } from './lessons/index.js'
import { KEYS, clearProgress, load, save } from './storage.js'

// JS 기초가 첫 탭이자 첫 진입이다. JS를 아는 사람은 JS 1 첫 문단의 링크로 레슨 탭에 간다.
const TABS = [
  { id: 'js', label: 'JS 기초' },
  { id: 'lessons', label: '레슨' },
  { id: 'labs', label: '실험실' },
  { id: 'playground', label: '플레이그라운드' },
]

export default function App() {
  const [last] = useState(() => load(KEYS.last, {}))
  const [tab, setTab] = useState(() => (TABS.some((t) => t.id === last.tab) ? last.tab : 'js'))
  const [lessonId, setLessonId] = useState(() =>
    lessons.some((l) => l.id === last.lessonId) ? last.lessonId : lessons[0]?.id,
  )
  const [jsLessonId, setJsLessonId] = useState(() =>
    jsLessons.some((l) => l.id === last.jsLessonId) ? last.jsLessonId : jsLessons[0]?.id,
  )
  const [progress, setProgress] = useState(() => load(KEYS.progress, []))
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [focusedDemo, setFocusedDemo] = useState(null)

  useEffect(() => {
    save(KEYS.last, { tab, lessonId, jsLessonId })
  }, [tab, lessonId, jsLessonId])

  useEffect(() => {
    save(KEYS.progress, progress)
  }, [progress])

  const lesson = lessons.find((l) => l.id === lessonId)
  const jsLesson = jsLessons.find((l) => l.id === jsLessonId)
  // 헤더 진행률은 보고 있는 트랙의 것이다. 실험실·플레이그라운드에서는 리액트 트랙을 보인다.
  const trackLessons = tab === 'js' ? jsLessons : lessons
  const doneCount = trackLessons.filter((l) => progress.includes(l.id)).length
  const pct = trackLessons.length ? Math.round((doneCount / trackLessons.length) * 100) : 0

  const complete = (id) => setProgress((prev) => (prev.includes(id) ? prev : [...prev, id]))
  // 링크는 트랙을 넘나든다(JS 레슨 → 리액트 레슨). 레슨이 속한 트랙의 탭으로 옮긴다.
  const goto = (id) => {
    if (isJsLesson(id)) {
      setJsLessonId(id)
      setTab('js')
    } else {
      setLessonId(id)
      setTab('lessons')
    }
    setDrawerOpen(false)
    window.scrollTo({ top: 0 })
    // 새 레슨이 그려진 뒤 제목에 포커스를 둔다. backToLesson과 같은 이유로 setTimeout이다.
    setTimeout(() => document.getElementById('lesson-title')?.focus({ preventScroll: true }), 0)
  }
  const openDemo = (demoId) => {
    setFocusedDemo(demoId)
    setTab('labs')
  }
  // PRD: 읽던 자리에서 데모를 확인하고 돌아온다. 레슨이 다시 그려지므로 픽셀이 아니라 데모 링크로 돌아간다.
  // 좁은 화면에서는 결과 패널이 600ms 뒤에 채워지며 링크를 밀어내므로, 사용자가 그새 스크롤하지 않았으면 한 번 더 맞춘다.
  const backToLesson = () => {
    setFocusedDemo(null)
    setTab('lessons')
    const toLink = () => document.getElementById('lesson-demo-link')?.scrollIntoView({ block: 'center' })
    // requestAnimationFrame은 그려지지 않는 탭에서 멈추므로 setTimeout을 쓴다. 클릭 처리 뒤라 커밋은 끝나 있다.
    setTimeout(() => {
      toLink()
      const settled = window.scrollY
      setTimeout(() => {
        if (window.scrollY === settled) toLink()
      }, 800)
    }, 0)
  }

  // 두 트랙이 같은 화면 틀을 쓴다. 레일, 모바일 드로어, 레슨 본문.
  const renderTrack = (trackChapters, current) => (
    <div className="lessons-layout">
      <aside className={`rail-slot${drawerOpen ? ' is-open' : ''}`}>
        <LessonRail
          key={trackChapters[0].id}
          chapters={trackChapters}
          currentId={current?.id}
          progress={progress}
          onPick={goto}
        />
      </aside>

      <main className="app-body">
        {current ? (
          <>
            <button
              className="drawer-toggle"
              aria-expanded={drawerOpen}
              onClick={() => setDrawerOpen((v) => !v)}
            >
              챕터 {current.chapter}. {chapterOf(current.chapter)?.title} · {current.title}
            </button>
            {/* 레슨이 바뀌면 안의 state(확인 문제 선택, 펼친 블록)를 전부 새로 시작한다. 레슨 21의 그 key다. */}
            <Lesson
              key={current.id}
              lesson={current}
              done={progress.includes(current.id)}
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
  )

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
        <div className="progress" title={`${doneCount}/${trackLessons.length} 레슨 완료`}>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${pct}%` }} />
          </div>
          <span className="progress-text">
            {doneCount}/{trackLessons.length}
          </span>
          <button
            className="ghost"
            disabled={progress.length === 0}
            onClick={() => {
              // 한 번 누르면 되돌릴 수 없다. 확인을 받는다.
              if (!window.confirm('완료 표시를 전부 지웁니다. 편집한 코드는 남습니다.')) return
              clearProgress()
              setProgress([])
            }}
          >
            초기화
          </button>
        </div>
      </header>

      {tab === 'lessons' || tab === 'js' ? (
        renderTrack(tab === 'js' ? jsChapters : chapters, tab === 'js' ? jsLesson : lesson)
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
