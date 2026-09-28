import { useCallback, useState } from 'react'
import Code from './Code.jsx'
import CodeSandbox from './CodeSandbox.jsx'
import Quiz from './Quiz.jsx'
import { demoById } from './labs/index.jsx'
import { chapterOf, lessons, lessonsOf } from './lessons/index.js'
import { KEYS, load, save } from './storage.js'

function Paragraphs({ text }) {
  return text
    .split('\n\n')
    .map((p, i) => <p key={i}>{p}</p>)
}

/** 글 안의 "레슨 N"을 그 레슨으로 가는 링크로 바꾼다. PRD: 더 파고들면은 가능하면 다른 레슨으로 잇는다. */
function LinkedText({ text, onNavigate }) {
  return text.split(/(레슨 \d+)/).map((part, i) => {
    const m = /^레슨 (\d+)$/.exec(part)
    const target = m && lessons.find((l) => l.order === Number(m[1]))
    return target ? (
      <button key={i} className="inline-link" onClick={() => onNavigate(target.id)}>
        {part}
      </button>
    ) : (
      part
    )
  })
}

/**
 * 더 파고들면 답. 빈 줄로 나눈 덩어리 중 코드로 보이는 첫 덩어리부터 끝까지를 코드 한 블록으로 그린다.
 * 코드 안에도 빈 줄이 있으므로 덩어리마다 따로 판단하면 코드가 쪼개진다.
 */
const looksLikeCode = (chunk) => chunk.includes('\n') || /^(let|const|function|class|import|export) /.test(chunk)

function DeeperAnswer({ text, onNavigate }) {
  const chunks = text.split('\n\n')
  const codeAt = chunks.findIndex(looksLikeCode)
  const prose = codeAt === -1 ? chunks : chunks.slice(0, codeAt)
  return (
    <>
      {prose.map((chunk, i) => (
        <p key={i}>
          <LinkedText text={chunk} onNavigate={onNavigate} />
        </p>
      ))}
      {codeAt !== -1 && <Code code={chunks.slice(codeAt).join('\n\n')} />}
    </>
  )
}

/** 개념 레슨의 그림. 단계를 화살표로 잇는다. 좁은 화면에서는 세로로 쌓인다. */
function Figure({ figure }) {
  return (
    <figure className="flow">
      <ol>
        {figure.steps.map((step, i) => (
          <li key={i}>
            <strong>{step.title}</strong>
            <span>{step.note}</span>
          </li>
        ))}
      </ol>
      {figure.caption && <figcaption>{figure.caption}</figcaption>}
    </figure>
  )
}

/**
 * 레슨 본문. 블록 순서는 손이 먼저, 배경이 나중이다.
 * JS 되짚기 · 한 줄 정의 · 지금 방식 · 없던 시절 · 왜 나왔나 · 더 파고들면 · 확인 문제.
 * 뒤의 세 블록은 있는 레슨에만 나온다.
 */
export default function Lesson({ lesson, done, onComplete, onNavigate, onOpenDemo }) {
  const chapter = chapterOf(lesson.chapter)
  const siblings = lessonsOf(lesson.chapter)
  const isFirstOfChapter = siblings[0]?.id === lesson.id
  const isLastOfChapter = siblings[siblings.length - 1]?.id === lesson.id
  const at = lessons.findIndex((l) => l.id === lesson.id)
  const prev = lessons[at - 1]
  const next = lessons[at + 1]
  const demo = lesson.demo ? demoById(lesson.demo) : null

  // 레슨별 편집 초안. 이 컴포넌트는 lesson.id로 key가 걸려 레슨마다 새로 읽는다.
  // 초기 코드는 고정이고 앞 레슨의 수정을 물려받지 않지만, 이 레슨에서 고친 것은 남는다.
  const [initialCode] = useState(() => load(KEYS.drafts, {})[lesson.id] ?? lesson.starterCode)
  const saveDraft = useCallback(
    (code) => {
      const drafts = load(KEYS.drafts, {})
      if (code === lesson.starterCode) delete drafts[lesson.id]
      else drafts[lesson.id] = code
      save(KEYS.drafts, drafts)
    },
    [lesson.id, lesson.starterCode],
  )

  return (
    <article className="tab-body lesson">
      {isFirstOfChapter && chapter?.intro && (
        <section className="chapter-note">
          <h2>
            챕터 {chapter.id}. {chapter.title}
          </h2>
          <Paragraphs text={chapter.intro} />
        </section>
      )}

      <header className="body-head">
        <p className="crumb">
          챕터 {lesson.chapter}. {chapter?.title}
        </p>
        <h2>
          {lesson.order}. {lesson.title}
        </h2>
        {lesson.tagline && <p className="tagline">{lesson.tagline}</p>}
      </header>

      {lesson.jsPrereq?.length > 0 && (
        <section className="block prereq">
          <h3 className="block-head">JS 되짚기</h3>
          <ul>
            {lesson.jsPrereq.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="block">
        <h3 className="block-head">한 줄 정의</h3>
        <p className="definition">{lesson.definition}</p>
      </section>

      <section className="block">
        <h3 className="block-head">지금 방식</h3>
        {lesson.goal && (
          <p className={lesson.broken ? 'goal goal-broken' : lesson.solutionCode ? 'goal goal-task' : 'goal'}>
            {lesson.broken && <strong>고쳐야 하는 코드 · </strong>}
            {!lesson.broken && lesson.solutionCode && <strong>할 일 · </strong>}
            {lesson.goal}
          </p>
        )}

        {lesson.kind === 'checklist' &&
          lesson.items.map((item, i) => (
            <div className="check-item" key={i}>
              <h4>{item.title}</h4>
              <p>{item.text}</p>
              <Code code={item.code} />
            </div>
          ))}

        {lesson.kind === 'concept' && lesson.figure && <Figure figure={lesson.figure} />}

        {lesson.kind === 'concept' && (
          // 파일 두 개면 나란히 둔다(PRD 레슨 4). 넓은 화면에서만, 좁으면 쌓인다.
          <div className={lesson.readOnly?.length === 2 ? 'files files-pair' : 'files'}>
            {lesson.readOnly?.map((file) => (
              <div className="file" key={file.filename}>
                <p className="filename">{file.filename}</p>
                <Code code={file.code} />
              </div>
            ))}
          </div>
        )}

        {lesson.kind === 'practice' && (
          <CodeSandbox
            initialCode={initialCode}
            resetCode={lesson.starterCode}
            solutionCode={lesson.solutionCode}
            onCodeChange={saveDraft}
          />
        )}
      </section>

      {lesson.before && (
        <section className="block">
          <h3 className="block-head">없던 시절</h3>
          <p>{lesson.before.text}</p>
          <Code code={lesson.before.code} />
          <p className="panel-hint">이 코드는 실행하지 않는다. 위 예제와 같은 문제를 푸는 짝이다.</p>
        </section>
      )}

      {demo && (
        <section className="block">
          <h3 className="block-head">실험실</h3>
          <button id="lesson-demo-link" className="demo-link" onClick={() => onOpenDemo(demo.id)}>
            <span className="demo-link-title">{demo.title} 데모 열기 →</span>
            <span className="demo-link-what">{demo.what}</span>
          </button>
        </section>
      )}

      {lesson.why?.length > 0 && (
        <section className="block">
          <h3 className="block-head">왜 나왔나</h3>
          {lesson.why.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </section>
      )}

      {lesson.deeper?.length > 0 && (
        <section className="block">
          <h3 className="block-head">더 파고들면</h3>
          {lesson.deeper.map((d, i) => (
            <details className="deeper" key={i}>
              <summary>{d.question}</summary>
              <DeeperAnswer text={d.answer} onNavigate={onNavigate} />
            </details>
          ))}
        </section>
      )}

      <Quiz
        quiz={lesson.quiz}
        done={done}
        onCorrect={() => onComplete(lesson.id)}
        onNext={next ? () => onNavigate(next.id) : null}
        nextLabel={next ? `${next.order}. ${next.title}` : ''}
      />

      {lesson.sources?.length > 0 && (
        <p className="sources">
          근거:{' '}
          {lesson.sources.map((url) => (
            <a key={url} href={url} target="_blank" rel="noreferrer">
              {url}
            </a>
          ))}
        </p>
      )}

      {/* PRD: 마지막 레슨을 끝내면 마무리 문단이 나온다. 확인 문제를 맞힌 뒤에 보인다. */}
      {isLastOfChapter && chapter?.outro && done && (
        <section className="chapter-note">
          <h3>챕터 {chapter.id} 마무리</h3>
          <Paragraphs text={chapter.outro} />
        </section>
      )}

      <nav className="lesson-nav">
        <button className="ghost" disabled={!prev} onClick={() => onNavigate(prev.id)}>
          {prev ? `← ${prev.order}. ${prev.title}` : '← 처음 레슨'}
        </button>
        <button className="ghost" disabled={!next} onClick={() => onNavigate(next.id)}>
          {next ? `${next.order}. ${next.title} →` : '마지막 레슨 →'}
        </button>
      </nav>
    </article>
  )
}
