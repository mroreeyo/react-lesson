import { memo, useRef, useState } from 'react'

/**
 * 실험실 데모 3종. 코드가 아니라 동작을 보여준다.
 * 렌더 횟수는 렌더 중에 세므로 StrictMode가 켜진 개발 모드에서는 2씩 오른다.
 * 배포 빌드에서는 1씩 오른다. 학습자가 보는 것은 배포 빌드다.
 */

function useRenderCount() {
  const count = useRef(0)
  count.current += 1
  return count.current
}

/** 렌더될 때마다 테두리가 한 번 깜빡인다. key가 갈리므로 애니메이션이 다시 시작된다. */
function Flash({ count, children }) {
  return (
    <div className="flash-box" key={count}>
      {children}
      <span className="flash-count">렌더 {count}회</span>
    </div>
  )
}

// ── 1. 리렌더링 전파 ──────────────────────────────────

function Child({ label }) {
  const renders = useRenderCount()
  return (
    <Flash count={renders}>
      <strong>{label}</strong>
      <p>부모가 다시 그려질 때 나도 다시 그려지는가</p>
    </Flash>
  )
}

const MemoChild = memo(Child)

function RerenderDemo() {
  const [count, setCount] = useState(0)
  const [useMemoized, setUseMemoized] = useState(false)
  const parentRenders = useRenderCount()
  const Target = useMemoized ? MemoChild : Child

  return (
    <div className="demo-body">
      <div className="demo-controls">
        <button className="ghost" onClick={() => setCount((n) => n + 1)}>
          부모 카운트 증가 ({count})
        </button>
        <label className="switch">
          <input
            type="checkbox"
            checked={useMemoized}
            onChange={(e) => setUseMemoized(e.target.checked)}
          />
          자식을 memo로 감싸기
        </label>
      </div>

      <Flash count={parentRenders}>
        <strong>부모</strong>
        <p>카운트 {count}</p>
      </Flash>

      {/* memo를 켜고 끌 때 렌더 횟수를 0부터 다시 센다 */}
      <Target key={useMemoized ? 'memo' : 'plain'} label={useMemoized ? '자식 (memo)' : '자식'} />

      <p className="demo-note">
        자식은 props가 하나도 안 바뀌는데도 부모가 그려질 때마다 함께 그려진다. memo를 켜면
        props가 같을 때 건너뛴다.
      </p>
    </div>
  )
}

// ── 2. state와 ref ────────────────────────────────────

function StateVsRefDemo() {
  const [stateCount, setStateCount] = useState(0)
  const refCount = useRef(0)
  const [, force] = useState(0)
  const renders = useRenderCount()

  return (
    <div className="demo-body">
      <div className="demo-controls">
        <button className="ghost" onClick={() => setStateCount((n) => n + 1)}>
          state 증가
        </button>
        <button className="ghost" onClick={() => (refCount.current += 1)}>
          ref 증가
        </button>
        <button className="ghost" onClick={() => force((n) => n + 1)}>
          강제 렌더
        </button>
      </div>

      <Flash count={renders}>
        <table className="demo-table">
          <tbody>
            <tr>
              <th>useState</th>
              <td>{stateCount}</td>
            </tr>
            <tr>
              <th>useRef</th>
              <td>{refCount.current}</td>
            </tr>
          </tbody>
        </table>
      </Flash>

      <p className="demo-note">
        ref를 여러 번 올려도 화면의 숫자는 그대로다. 값은 이미 바뀌었지만 다시 그리지 않기
        때문이다. 강제 렌더를 누르면 그때 올라간 값이 한꺼번에 보인다.
      </p>
    </div>
  )
}

// ── 3. key의 영향 ─────────────────────────────────────

let nextId = 4
const INITIAL = [
  { id: 'a', title: '장보기' },
  { id: 'b', title: '설거지' },
  { id: 'c', title: '빨래' },
]

function KeyList({ todos, keyBy }) {
  return (
    <div className="key-col">
      <p className="key-label">
        key = <code>{keyBy === 'index' ? 'index' : 'todo.id'}</code>
      </p>
      <ul className="key-list">
        {todos.map((todo, i) => (
          <li key={keyBy === 'index' ? i : todo.id}>
            {/* 값을 리액트가 들고 있지 않은 입력창. 항목이 어긋나면 그대로 드러난다 */}
            <input defaultValue="" placeholder={todo.title} aria-label={`${todo.title} 메모`} />
          </li>
        ))}
      </ul>
    </div>
  )
}

function KeyDemo() {
  const [todos, setTodos] = useState(INITIAL)

  return (
    <div className="demo-body">
      <div className="demo-controls">
        <button
          className="ghost"
          onClick={() => setTodos([{ id: `n${nextId++}`, title: '새 할 일' }, ...todos])}
        >
          맨 앞에 추가
        </button>
        <button className="ghost" onClick={() => setTodos(INITIAL)}>
          되돌리기
        </button>
      </div>

      <p className="demo-note">
        양쪽 입력창에 아무 글자나 쓰고, 맨 앞에 추가를 눌러 보세요. 같은 데이터에 key만 다릅니다.
      </p>

      <div className="key-pair">
        <KeyList todos={todos} keyBy="index" />
        <KeyList todos={todos} keyBy="id" />
      </div>

      <p className="demo-note">
        index 쪽은 쓴 글자가 자리에 남아 엉뚱한 항목에 붙는다. 자리 번호가 밀렸는데 리액트는
        0번을 여전히 0번으로 보기 때문이다. id 쪽은 글자가 원래 항목을 따라간다.
      </p>
    </div>
  )
}

// ── 레지스트리 ────────────────────────────────────────

export const demos = [
  {
    id: 'rerender',
    title: '리렌더링 전파',
    what: '부모 state가 바뀌면 어떤 자식이 다시 그려지는지',
    Component: RerenderDemo,
  },
  {
    id: 'state-ref',
    title: 'state와 ref',
    what: 'useState는 화면을 갱신하고 useRef는 값만 바꾼다',
    Component: StateVsRefDemo,
  },
  {
    id: 'key',
    title: 'key의 영향',
    what: 'index key와 id key를 나란히 두고 앞에 항목을 넣어 본다',
    Component: KeyDemo,
  },
]

export const demoById = (id) => demos.find((d) => d.id === id)
