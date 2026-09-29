import { useCallback, useState } from 'react'
import Code, { InlineCode } from './Code.jsx'
import CodeSandbox from './CodeSandbox.jsx'
import Quiz from './Quiz.jsx'
import { demoById } from './labs/index.jsx'
import { chapterOf, jsLessons, lessons, lessonsOf } from './lessons/index.js'
import { KEYS, load, save } from './storage.js'

function Paragraphs({ text, onNavigate }) {
  return text.split('\n\n').map((p, i) => (
    <p key={i}>
      <LinkedText text={p} onNavigate={onNavigate} />
    </p>
  ))
}

/**
 * 글 안의 "레슨 N"(리액트)과 "JS N"(JS 기초)을 그 레슨으로 가는 링크로 바꾼다. PRD: 더 파고들면은 가능하면 다른 레슨으로 잇는다.
 * "레슨 39개"처럼 개수를 말하는 자리는 잇지 않는다. 아직 없는 레슨 번호는 글자로 둔다.
 */
function LinkedText({ text, onNavigate }) {
  return <InlineCode text={text} renderText={(t) => <LinkedPlain text={t} onNavigate={onNavigate} />} />
}

function LinkedPlain({ text, onNavigate }) {
  return text.split(/((?:레슨|JS) \d+)(?![\d개])/).map((part, i) => {
    const m = /^(레슨|JS) (\d+)$/.exec(part)
    const target = m && (m[1] === 'JS' ? jsLessons : lessons).find((l) => l.order === Number(m[2]))
    return target ? (
      <button key={i} className="inline-link" onClick={() => onNavigate(target.id)}>
        {part}
      </button>
    ) : (
      part
    )
  })
}

/** 리액트 레슨에서 JS 레슨으로 돌아가는 길. 글 끝에 붙이면 LinkedText가 "JS N"을 링크로 바꾼다. */
const backToJs = (jsId) => {
  const js = jsLessons.find((l) => l.id === jsId)
  return js ? ` 잘 모르겠으면 → JS ${js.order}. ${js.title}` : ''
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

/** 편집기 초안 하나. key마다 저장소의 drafts에 두고, 초기 코드와 같아지면 지운다. */
function useDraft(key, starter) {
  const [initial] = useState(() => load(KEYS.drafts, {})[key] ?? starter)
  const saveDraft = useCallback(
    (code) => {
      const drafts = load(KEYS.drafts, {})
      if (code === starter) delete drafts[key]
      else drafts[key] = code
      save(KEYS.drafts, drafts)
    },
    [key, starter],
  )
  return [initial, saveDraft]
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
  const isJs = chapter?.track === 'js'
  // 이전/다음은 트랙 안에서만 움직인다. JS 트랙의 끝에서 리액트로 넘어가는 길은 마지막 챕터의 마무리 문단에 둔다.
  const track = isJs ? jsLessons : lessons
  const at = track.findIndex((l) => l.id === lesson.id)
  const prev = track[at - 1]
  const next = track[at + 1]
  const demo = lesson.demo ? demoById(lesson.demo) : null

  // 레슨별 편집 초안. 이 컴포넌트는 lesson.id로 key가 걸려 레슨마다 새로 읽는다.
  // 초기 코드는 고정이고 앞 레슨의 수정을 물려받지 않지만, 이 레슨에서 고친 것은 남는다.
  const [initialCode, saveDraft] = useDraft(lesson.id, lesson.starterCode)
  // 챕터 끝 '스스로 해보기'의 초안은 따로 둔다. 훅은 조건 없이 부르고, 문제가 없는 레슨에서는 쓰지 않는다.
  const [challengeCode, saveChallenge] = useDraft(`${lesson.id}:challenge`, lesson.challenge?.starterCode ?? '')

  return (
    <article className="tab-body lesson">
      {isFirstOfChapter && chapter?.intro && (
        <section className="chapter-note">
          <h2>
            챕터 {chapter.id}. {chapter.title}
          </h2>
          <Paragraphs text={chapter.intro} onNavigate={onNavigate} />
        </section>
      )}

      <header className="body-head">
        <p className="crumb">
          챕터 {lesson.chapter}. {chapter?.title}
        </p>
        {/* 레슨을 옮기면 App이 여기로 포커스를 보낸다. 누른 버튼이 사라져도 키보드 위치가 맨 위로 튀지 않는다. */}
        <h2 id="lesson-title" tabIndex={-1}>
          {lesson.order}. {lesson.title}
        </h2>
        {lesson.tagline && <p className="tagline">{lesson.tagline}</p>}
      </header>

      {lesson.jsPrereq?.length > 0 && (
        <section className="block prereq">
          <h3 className="block-head">JS 되짚기</h3>
          <ul>
            {lesson.jsPrereq.map((item, i) => (
              // 항목은 글자 하나이거나 { text, js }다. js가 있으면 그 JS 레슨으로 가는 링크를 붙인다.
              <li key={i}>
                <LinkedText
                  text={typeof item === 'string' ? item : item.text + backToJs(item.js)}
                  onNavigate={onNavigate}
                />
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="block">
        <h3 className="block-head">한 줄 정의</h3>
        <p className="definition">
          <LinkedText text={lesson.definition} onNavigate={onNavigate} />
        </p>
      </section>

      <section className="block">
        <h3 className="block-head">지금 방식</h3>
        {lesson.goal && (
          <div className={lesson.broken ? 'goal goal-broken' : lesson.solutionCode ? 'goal goal-task' : 'goal'}>
            {lesson.broken && <strong>고쳐야 하는 코드 · </strong>}
            {!lesson.broken && lesson.solutionCode && <strong>할 일 · </strong>}
            {/* 할 일이 여럿이면 배열로 적고 번호를 붙인다. 한 문단에 몰면 입문자가 어디까지 했는지 놓친다. */}
            {Array.isArray(lesson.goal) ? (
              <ol className="goal-steps">
                {lesson.goal.map((step, i) => (
                  <li key={i}>
                    <LinkedText text={step} onNavigate={onNavigate} />
                  </li>
                ))}
              </ol>
            ) : (
              <LinkedText text={lesson.goal} onNavigate={onNavigate} />
            )}
          </div>
        )}

        {lesson.kind === 'checklist' &&
          lesson.items.map((item, i) => (
            <div className="check-item" key={i}>
              <h4>{item.title}</h4>
              <p>
                <LinkedText text={item.text + backToJs(item.js)} onNavigate={onNavigate} />
              </p>
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
            outputUnchanged={lesson.outputUnchanged}
            mode={isJs ? 'console' : 'react'}
          />
        )}
      </section>

      {lesson.before && (
        <section className="block">
          <h3 className="block-head">없던 시절</h3>
          <p>
            <LinkedText text={lesson.before.text} onNavigate={onNavigate} />
          </p>
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
            <p key={i}>
              <LinkedText text={p} onNavigate={onNavigate} />
            </p>
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

      {lesson.usedIn?.length > 0 && (
        <section className="block">
          <h3 className="block-head">리액트에서 쓰는 곳</h3>
          <p>
            이 문법은 다음 리액트 레슨에 나온다:{' '}
            <LinkedText text={lesson.usedIn.map((n) => `레슨 ${n}`).join(', ')} onNavigate={onNavigate} />
          </p>
        </section>
      )}

      {lesson.challenge && (
        // 챕터 끝 문제. 할 일 단계 없이 목표 출력만 주고, 콘솔 출력이 정답과 같아지면 편집기 쪽에서 알려 준다.
        <section className="block">
          <h3 className="block-head">챕터 {chapter.id} 스스로 해보기</h3>
          <p className="goal goal-task">
            <strong>목표 · </strong>
            <LinkedText text={lesson.challenge.goal} onNavigate={onNavigate} />
          </p>
          <p className="panel-hint">이렇게 찍히면 된다.</p>
          <pre className="expected-output">{lesson.challenge.target}</pre>
          <CodeSandbox
            initialCode={challengeCode}
            resetCode={lesson.challenge.starterCode}
            solutionCode={lesson.challenge.solutionCode}
            onCodeChange={saveChallenge}
            mode="console"
            label="스스로 해보기 편집기"
          />
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
          <Paragraphs text={chapter.outro} onNavigate={onNavigate} />
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
