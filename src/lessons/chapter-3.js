export default [
  {
    id: 'react-to-input',
    chapter: '3',
    order: 18,
    title: 'state로 입력에 반응하기',
    tagline: '화면의 상태를 먼저 적는다',
    kind: 'practice',
    definition:
      '화면이 가질 수 있는 상태를 먼저 적고, 각 상태에서 무엇을 그릴지 정한다. 요소를 찾아 보이고 숨기는 것이 아니라, 상태를 바꿔서 화면을 고른다. 서로 하나만 고를 수 있는 상태들은 값 하나에 담는다.',
    goal: '전체 · 남은 것 · 끝낸 것 필터가 붙는다. 보여줄 것이 없을 때 문장이 바뀐다.',
    starterCode: `let nextId = 4

function TodoCard({ todo, onToggle }) {
  return (
    <li>
      <input type="checkbox" checked={todo.done} onChange={() => onToggle(todo.id)} />
      <span>{todo.title}</span>
      {todo.done && <em> · 끝</em>}
    </li>
  )
}

function App() {
  const [todos, setTodos] = useState([
    { id: 'a', title: '장보기', done: true },
    { id: 'b', title: '설거지', done: false },
    { id: 'c', title: '빨래', done: false },
  ])
  const [draft, setDraft] = useState('')
  const [filter, setFilter] = useState('all')

  // 필터는 세 상태 중 하나다. 무엇을 보여줄지는 그 상태에서 계산한다.
  const shown =
    filter === 'left' ? todos.filter((todo) => !todo.done)
    : filter === 'done' ? todos.filter((todo) => todo.done)
    : todos

  function toggle(id) {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, done: !todo.done } : todo)))
  }

  function add() {
    if (draft.trim() === '') return
    setTodos([...todos, { id: 'n' + nextId++, title: draft, done: false }])
    setDraft('')
  }

  return (
    <section>
      <h2>할 일 {todos.length}개</h2>
      <div>
        <button onClick={() => setFilter('all')} disabled={filter === 'all'}>전체</button>
        <button onClick={() => setFilter('left')} disabled={filter === 'left'}>남은 것</button>
        <button onClick={() => setFilter('done')} disabled={filter === 'done'}>끝낸 것</button>
      </div>
      {shown.length === 0 ? (
        <p>여기 보여줄 것이 없다</p>
      ) : (
        <ul>
          {shown.map((todo) => (
            <TodoCard key={todo.id} todo={todo} onToggle={toggle} />
          ))}
        </ul>
      )}
      <input value={draft} placeholder="새 할 일" onChange={(e) => setDraft(e.target.value)} />
      <button onClick={add}>추가</button>
    </section>
  )
}
`,
    deeper: [
      {
        question: '필터를 불리언 두 개로 두면 무엇이 달라지는가',
        answer:
          '`showLeft`와 `showDone`을 따로 두면 둘 다 true이거나 둘 다 false인 상태가 생긴다. 화면에 뜻이 없는 조합이 만들어진다. 서로 배타적인 선택은 값 하나로 두는 쪽이 안전하다.',
      },
      {
        question: '요소를 숨기는 것과 안 그리는 것은 다른가',
        answer:
          '다르다. CSS로 숨긴 요소는 여전히 화면에 있고 그 안의 입력값도 남아 있다. 안 그리면 그 요소가 사라지고 안에 있던 state도 함께 사라진다. 레슨 21이 그 이야기다.',
      },
    ],
    sources: ['https://react.dev/learn/reacting-to-input-with-state'],
    quiz: {
      question: '서로 배타적인 화면 상태 세 개를 다룰 때 권하는 방식은 무엇인가',
      options: [
        '불리언 세 개를 두고 하나만 true로 유지한다',
        '값 하나에 세 상태 중 하나를 담는다',
        '요소를 CSS로 숨기고 보이기만 바꾼다',
      ],
      answerIndex: 1,
      explanation:
        '불리언 여러 개는 뜻이 없는 조합을 만든다. 하나만 고를 수 있는 값으로 두면 그런 조합이 애초에 생기지 않는다.',
    },
  },
  {
    id: 'state-structure',
    chapter: '3',
    order: 19,
    broken: true,
    title: 'state 구조 선택하기',
    tagline: '계산할 수 있는 값은 state에 두지 않는다',
    kind: 'practice',
    definition:
      '다른 state로 계산할 수 있는 값은 state에 두지 않는다. 두 곳에 같은 사실이 있으면 한쪽이 반드시 늦는다.',
    goal: '지금 이 코드는 틀렸다. 체크박스를 눌러 보면 남은 개수가 안 맞는다. leftCount를 state에서 빼고 계산으로 바꾼다.',
    starterCode: `let nextId = 4

function TodoCard({ todo, onToggle }) {
  return (
    <li>
      <input type="checkbox" checked={todo.done} onChange={() => onToggle(todo.id)} />
      <span>{todo.title}</span>
      {todo.done && <em> · 끝</em>}
    </li>
  )
}

function App() {
  const [todos, setTodos] = useState([
    { id: 'a', title: '장보기', done: true },
    { id: 'b', title: '설거지', done: false },
    { id: 'c', title: '빨래', done: false },
  ])
  const [draft, setDraft] = useState('')

  // 같은 사실이 두 곳에 있다. todos에도 있고 여기에도 있다.
  const [leftCount, setLeftCount] = useState(2)

  function toggle(id) {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, done: !todo.done } : todo)))
    // 토글할 때는 leftCount를 안 고쳤다. 그래서 숫자가 그대로 남는다.
  }

  function add() {
    if (draft.trim() === '') return
    setTodos([...todos, { id: 'n' + nextId++, title: draft, done: false }])
    setLeftCount(leftCount + 1)
    setDraft('')
  }

  return (
    <section>
      <h2>할 일 {todos.length}개</h2>
      <p>남은 것 {leftCount}개</p>
      <ul>
        {todos.map((todo) => (
          <TodoCard key={todo.id} todo={todo} onToggle={toggle} />
        ))}
      </ul>
      <input value={draft} placeholder="새 할 일" onChange={(e) => setDraft(e.target.value)} />
      <button onClick={add}>추가</button>
    </section>
  )
}
`,
    deeper: [
      {
        question: '고치는 코드를 빠뜨리지 않으면 되지 않는가',
        answer:
          '고칠 곳이 늘어날 뿐이다. 삭제, 전체 완료, 되돌리기가 생기면 그때마다 같은 숫자를 또 맞춰야 한다. 계산으로 두면 고칠 곳이 애초에 하나다.',
      },
      {
        question: '계산이 비싸면 어떻게 하는가',
        answer:
          '그때 useMemo로 결과를 기억해 둔다. state로 옮기는 것이 아니다. 여전히 계산이고, 다시 계산할 필요가 없을 때만 건너뛰는 것이다. 레슨 33이 그 자리다.',
      },
      {
        question: 'props를 초기값으로 받은 state는 어떤가',
        answer:
          '같은 문제다. `useState(props.title)`은 props가 바뀌어도 따라가지 않는다. 처음 값만 받고 이후에는 별개로 산다. 그걸 원한 게 아니라면 state로 두지 않는다.',
      },
    ],
    sources: ['https://react.dev/learn/choosing-the-state-structure'],
    quiz: {
      question: '`todos`가 있는데 `leftCount`를 따로 state에 두면 무엇이 문제인가',
      options: [
        '메모리를 두 배로 쓴다',
        '같은 사실이 두 곳에 있어서, 한쪽만 고치면 화면이 어긋난다',
        '리액트가 경고를 낸다',
      ],
      answerIndex: 1,
      explanation:
        '두 곳을 늘 같이 고쳐야 하는데, 고칠 자리가 늘어나면 언젠가 하나를 빠뜨린다. 계산할 수 있는 값은 계산한다.',
    },
  },
  {
    id: 'sharing-state',
    chapter: '3',
    order: 20,
    title: '컴포넌트 간 state 공유하기',
    tagline: '공통 부모로 올린다',
    kind: 'practice',
    definition:
      '두 컴포넌트가 같은 값을 보거나 바꿔야 하면, 그 값을 둘의 가장 가까운 공통 부모로 올린다. 값은 props로 내려가고, 바꾸는 함수도 props로 내려간다.',
    goal: '필터 바와 목록을 각자 컴포넌트로 뗀다. 둘이 같은 filter를 보게 된다.',
    starterCode: `let nextId = 4

function FilterBar({ filter, counts, onChange }) {
  return (
    <div>
      <button onClick={() => onChange('all')} disabled={filter === 'all'}>
        전체 {counts.all}
      </button>
      <button onClick={() => onChange('left')} disabled={filter === 'left'}>
        남은 것 {counts.left}
      </button>
      <button onClick={() => onChange('done')} disabled={filter === 'done'}>
        끝낸 것 {counts.done}
      </button>
    </div>
  )
}

function TodoList({ todos, onToggle }) {
  if (todos.length === 0) return <p>여기 보여줄 것이 없다</p>

  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>
          <input type="checkbox" checked={todo.done} onChange={() => onToggle(todo.id)} />
          <span>{todo.title}</span>
          {todo.done && <em> · 끝</em>}
        </li>
      ))}
    </ul>
  )
}

function App() {
  // filter는 FilterBar와 TodoList 둘 다 필요하다. 그래서 공통 부모인 여기에 둔다.
  const [todos, setTodos] = useState([
    { id: 'a', title: '장보기', done: true },
    { id: 'b', title: '설거지', done: false },
    { id: 'c', title: '빨래', done: false },
  ])
  const [filter, setFilter] = useState('all')
  const [draft, setDraft] = useState('')

  const left = todos.filter((todo) => !todo.done)
  const done = todos.filter((todo) => todo.done)
  const shown = filter === 'left' ? left : filter === 'done' ? done : todos

  function toggle(id) {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, done: !todo.done } : todo)))
  }

  function add() {
    if (draft.trim() === '') return
    setTodos([...todos, { id: 'n' + nextId++, title: draft, done: false }])
    setDraft('')
  }

  return (
    <section>
      <h2>할 일 {todos.length}개</h2>
      {/* counts의 겉 중괄호는 JS 자리, 안 중괄호는 객체다 */}
      <FilterBar
        filter={filter}
        counts={{ all: todos.length, left: left.length, done: done.length }}
        onChange={setFilter}
      />
      <TodoList todos={shown} onToggle={toggle} />
      <input value={draft} placeholder="새 할 일" onChange={(e) => setDraft(e.target.value)} />
      <button onClick={add}>추가</button>
    </section>
  )
}
`,
    deeper: [
      {
        question: 'FilterBar 안에 filter state를 두면 왜 안 되는가',
        answer:
          '목록이 그 값을 볼 방법이 없다. state는 그 컴포넌트와 그 아래에서만 보인다. 형제에게는 보이지 않으므로 공통 부모로 올린다.',
      },
      {
        question: '올리다 보면 App이 전부 들고 있게 되는데',
        answer:
          '그래서 올릴 곳은 "가장 가까운" 공통 부모다. 그리고 App이 커지면 로직을 reducer로 빼고, 내려보내는 길을 Context로 줄인다. 다음 세 레슨이 그 순서다.',
      },
    ],
    sources: ['https://react.dev/learn/sharing-state-between-components'],
    quiz: {
      question: '형제 컴포넌트 둘이 같은 값을 봐야 할 때 어디에 두는가',
      options: [
        '둘 중 먼저 그려지는 쪽에 둔다',
        '둘의 가장 가까운 공통 부모에 두고 props로 내린다',
        '전역 변수에 둔다',
      ],
      answerIndex: 1,
      explanation:
        'state는 자기 자신과 그 아래에서만 보인다. 형제가 같이 봐야 하면 둘을 모두 품는 부모로 올린다.',
    },
  },
  {
    id: 'preserving-state',
    chapter: '3',
    order: 21,
    broken: true,
    title: 'state 보존과 초기화',
    tagline: '같은 자리면 state가 남는다',
    kind: 'practice',
    definition:
      'state는 컴포넌트가 아니라 화면 트리(컴포넌트가 부모·자식으로 겹친 모양)의 그 자리에 붙어 있다. 같은 자리에 같은 컴포넌트가 계속 있으면 state가 남고, 자리가 사라지면 state도 사라진다. key를 갈면 같은 자리라도 새 자리로 취급한다.',
    goal: '이름 고치기 칸이 붙는다. 지금은 다른 할 일을 골라도 입력칸이 앞 것을 그대로 들고 있다. key를 줘서 새로 시작하게 고친다.',
    starterCode: `function Editor({ todo, onRename }) {
  // 이 state는 Editor가 있는 자리에 붙어 있다. todo가 바뀌어도 그대로 남는다.
  const [text, setText] = useState(todo.title)

  return (
    <div>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={() => onRename(todo.id, text)}>이름 바꾸기</button>
    </div>
  )
}

function App() {
  const [todos, setTodos] = useState([
    { id: 'a', title: '장보기' },
    { id: 'b', title: '설거지' },
    { id: 'c', title: '빨래' },
  ])
  const [pickedId, setPickedId] = useState('a')
  const picked = todos.find((todo) => todo.id === pickedId)

  function rename(id, title) {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, title: title } : todo)))
  }

  return (
    <section>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <button onClick={() => setPickedId(todo.id)} disabled={todo.id === pickedId}>
              {todo.title}
            </button>
          </li>
        ))}
      </ul>

      {/* 다른 할 일을 골라도 아래 입력칸이 안 바뀐다. key를 주면 달라진다. */}
      <Editor todo={picked} onRename={rename} />
    </section>
  )
}
`,
    deeper: [
      {
        question: 'key로 초기화하는 것과 useEffect로 맞추는 것은 무엇이 다른가',
        answer:
          'key를 갈면 그 자리가 새로 시작하므로 안의 state가 전부 초기값이 된다. Effect로 맞추려면 어떤 state를 어떤 값으로 되돌릴지 하나씩 적어야 하고, 잠깐 이전 값이 보이는 순간이 생긴다.',
      },
      {
        question: '조건에 따라 컴포넌트를 다른 자리에 그리면 어떻게 되는가',
        answer:
          '자리가 달라지므로 state가 사라진다. `조건 ? <A/> : <B/>`에서 A와 B가 같은 컴포넌트여도 자리가 같으면 state가 남고, 트리 모양이 달라지면 사라진다. 자리는 "위치와 순서"로 정해진다.',
      },
    ],
    sources: ['https://react.dev/learn/preserving-and-resetting-state'],
    quiz: {
      question: '같은 자리의 컴포넌트에 `key`를 다른 값으로 주면 무엇이 일어나는가',
      options: [
        '아무 일도 없다. key는 목록에서만 쓴다',
        '리액트가 다른 컴포넌트로 보고 state를 버리고 새로 만든다',
        '렌더가 빨라진다',
      ],
      answerIndex: 1,
      explanation:
        'key는 "이건 아까 그것"을 알려준다. key가 달라지면 아까 그것이 아니므로 state를 버린다.',
    },
  },
  {
    id: 'reducer',
    chapter: '3',
    order: 22,
    title: 'reducer로 state 로직 추출하기',
    tagline: '무엇이 일어났는지를 보낸다',
    kind: 'practice',
    jsPrereq: ['switch는 값에 따라 갈래를 고른다. case마다 return하면 break가 필요 없다'],
    definition:
      'useReducer는 state를 바꾸는 방법을 한 함수에 모은다. 컴포넌트는 "무엇이 일어났는지"만 보내고, 그 일이 state를 어떻게 바꾸는지는 reducer가 정한다. 보내는 함수가 dispatch, 보내는 객체가 action이다.',
    goal: '흩어져 있던 setTodos를 한 곳에 모은다. 앱이 하는 일 목록이 reducer만 읽어도 보인다.',
    starterCode: `let nextId = 4

function todosReducer(todos, action) {
  switch (action.type) {
    case 'added':
      return [...todos, { id: 'n' + nextId++, title: action.title, done: false }]
    case 'toggled':
      return todos.map((todo) =>
        todo.id === action.id ? { ...todo, done: !todo.done } : todo,
      )
    case 'deleted':
      return todos.filter((todo) => todo.id !== action.id)
    case 'allDone':
      return todos.map((todo) => ({ ...todo, done: true }))
    default:
      throw new Error('모르는 action: ' + action.type)
  }
}

function App() {
  const [todos, dispatch] = useReducer(todosReducer, [
    { id: 'a', title: '장보기', done: true },
    { id: 'b', title: '설거지', done: false },
    { id: 'c', title: '빨래', done: false },
  ])
  const [draft, setDraft] = useState('')

  const left = todos.filter((todo) => !todo.done).length

  return (
    <section>
      <h2>할 일 {todos.length}개</h2>
      <p>{left === 0 ? '다 끝났다' : '남은 것 ' + left + '개'}</p>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() => dispatch({ type: 'toggled', id: todo.id })}
            />
            <span>{todo.title}</span>
            <button onClick={() => dispatch({ type: 'deleted', id: todo.id })}>지우기</button>
          </li>
        ))}
      </ul>
      <input value={draft} placeholder="새 할 일" onChange={(e) => setDraft(e.target.value)} />
      <button
        onClick={() => {
          if (draft.trim() === '') return
          dispatch({ type: 'added', title: draft })
          setDraft('')
        }}
      >
        추가
      </button>
      <button onClick={() => dispatch({ type: 'allDone' })}>전부 끝내기</button>
    </section>
  )
}
`,
    before: {
      text: '버튼마다 setState를 흩어 놓았다. 추가하는 코드는 추가 버튼 옆에, 지우는 코드는 지우기 버튼 옆에, 전부 끝내는 코드는 또 다른 곳에 있었다.',
      code: `function App() {
  const [todos, setTodos] = useState([])

  function add(title) {
    setTodos([...todos, { id: 'n1', title: title, done: false }])
  }

  function toggle(id) {
    setTodos(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
  }

  function remove(id) {
    setTodos(todos.filter((t) => t.id !== id))
  }

  function finishAll() {
    setTodos(todos.map((t) => ({ ...t, done: true })))
  }
  // ...버튼이 늘어나면 이 목록도 늘어난다
}
`,
    },
    why: [
      '상태가 어떤 순서로 어떻게 바뀌는지 알려면 컴포넌트 전체를 뒤져야 했다. state를 고치는 코드가 화면을 그리는 코드 사이사이에 섞여 있었기 때문이다.',
      'reducer는 그 코드를 컴포넌트 밖 한 함수로 모은다. 화면 쪽에는 "무슨 일이 일어났다"만 남는다. 바뀌는 방법이 한 곳에 있으니 읽고 시험하기도 쉽다.',
    ],
    deeper: [
      {
        question: 'useState 대신 항상 reducer를 쓰면 되는가',
        answer:
          '아니다. 값 하나를 켜고 끄는 정도면 useState가 짧고 읽기 쉽다. 바꾸는 방법이 여러 가지이고 서로 얽히기 시작할 때 reducer로 옮긴다.',
      },
      {
        question: 'Redux와는 무슨 관계인가',
        answer:
          '같은 발상이다. Redux는 이 reducer를 앱 전체에 하나 두고 미들웨어와 개발 도구를 붙인 것이다. useReducer는 그 발상만 컴포넌트 단위로 가져왔다. 라이브러리가 아니라 리액트에 들어 있는 훅이다.',
      },
      {
        question: 'reducer 안에서 배열을 직접 고치면 어떻게 되는가',
        answer:
          '레슨 17과 같은 문제가 난다. reducer도 새 state를 돌려줘야 한다. push로 고친 같은 배열을 돌려주면 리액트는 바뀐 것이 없다고 본다.',
      },
    ],
    sources: ['https://react.dev/learn/extracting-state-logic-into-a-reducer'],
    quiz: {
      question: 'reducer 함수가 하는 일은 무엇인가',
      options: [
        '현재 state와 action을 받아 다음 state를 돌려준다',
        'state를 직접 고치고 화면을 다시 그린다',
        'action을 서버로 보낸다',
      ],
      answerIndex: 0,
      explanation:
        '지금 state와 무슨 일이 일어났는지를 받아 다음 state를 돌려주는 순수한 함수다. 화면을 그리는 일과는 상관이 없다.',
    },
  },
  {
    id: 'context',
    chapter: '3',
    order: 23,
    title: 'Context로 데이터 깊게 전달하기',
    tagline: '거쳐 가는 컴포넌트를 건너뛴다',
    kind: 'practice',
    definition:
      'Context는 값을 트리 아래 어디서든 읽을 수 있게 한다. 위에서 Provider로 값을 넣고, 아래에서 useContext로 꺼낸다. 중간 컴포넌트를 거치지 않는다.',
    goal: 'TodoList는 쓰지도 않는 dispatch를 넘겨받지 않게 된다. 항목이 직접 가져간다.',
    starterCode: `const DispatchContext = createContext(null)

let nextId = 4

function todosReducer(todos, action) {
  switch (action.type) {
    case 'added':
      return [...todos, { id: 'n' + nextId++, title: action.title, done: false }]
    case 'toggled':
      return todos.map((todo) =>
        todo.id === action.id ? { ...todo, done: !todo.done } : todo,
      )
    default:
      throw new Error('모르는 action: ' + action.type)
  }
}

function TodoCard({ todo }) {
  // 부모가 넘겨주지 않았다. 여기서 직접 가져왔다.
  const dispatch = useContext(DispatchContext)

  return (
    <li>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={() => dispatch({ type: 'toggled', id: todo.id })}
      />
      <span>{todo.title}</span>
      {todo.done && <em> · 끝</em>}
    </li>
  )
}

// 이 컴포넌트는 dispatch를 쓰지 않는다. 그래서 받지도 않는다.
function TodoList({ todos }) {
  return (
    <ul>
      {todos.map((todo) => (
        <TodoCard key={todo.id} todo={todo} />
      ))}
    </ul>
  )
}

function App() {
  const [todos, dispatch] = useReducer(todosReducer, [
    { id: 'a', title: '장보기', done: true },
    { id: 'b', title: '설거지', done: false },
  ])
  const [draft, setDraft] = useState('')

  return (
    <DispatchContext.Provider value={dispatch}>
      <section>
        <h2>할 일 {todos.length}개</h2>
        <TodoList todos={todos} />
        <input value={draft} placeholder="새 할 일" onChange={(e) => setDraft(e.target.value)} />
        <button
          onClick={() => {
            if (draft.trim() === '') return
            dispatch({ type: 'added', title: draft })
            setDraft('')
          }}
        >
          추가
        </button>
      </section>
    </DispatchContext.Provider>
  )
}
`,
    before: {
      text: '값 하나를 아래로 내려보내려고 거쳐 가는 컴포넌트마다 props를 받아 그대로 넘겼다. 정작 그 컴포넌트는 값을 쓰지 않았다.',
      code: `<TodoList todos={todos} dispatch={dispatch} />

function TodoList({ todos, dispatch }) {
  // dispatch를 쓰지 않는다. 아래로 넘기려고 받았다.
  return todos.map((todo) => (
    <TodoRow key={todo.id} todo={todo} dispatch={dispatch} />
  ))
}

function TodoRow({ todo, dispatch }) {
  // 여기도 아래로 넘기려고 받았다
  return <TodoCard todo={todo} dispatch={dispatch} />
}
`,
    },
    why: [
      '값 하나를 더 내려보내려면 거쳐 가는 컴포넌트를 전부 고쳐야 했다. 중간 컴포넌트의 props 목록이 자기가 쓰지 않는 것들로 길어졌다.',
      'Context는 내려보내는 길을 만들지 않고, 읽는 쪽이 직접 가져가게 한다. 중간 컴포넌트는 그 값이 오가는 것을 모른다. 값이 바뀌면 그 값을 읽는 컴포넌트만 다시 그려진다.',
    ],
    deeper: [
      {
        question: 'Context는 상태 관리 도구인가',
        answer:
          '아니다. 값을 나르는 길이다. 값을 들고 바꾸는 것은 여전히 useState나 useReducer가 한다. Context는 그 값을 멀리까지 보이게만 해 준다.',
      },
      {
        question: 'Context 값이 바뀌면 어디까지 다시 그려지는가',
        answer:
          '그 값을 useContext로 읽는 컴포넌트 전부다. 중간에 있는 컴포넌트는 상관없다. 그래서 자주 바뀌는 값을 큰 Context 하나에 몰아 담으면 읽는 곳이 모두 함께 그려진다.',
      },
      {
        question: 'Provider 없이 읽으면 무엇이 나오는가',
        answer:
          '`createContext`에 준 기본값이다. 위 코드는 `null`을 줬으므로, Provider 밖에서 읽으면 dispatch가 null이 되어 클릭할 때 터진다. 기본값은 "없을 때 무엇인가"를 정하는 자리다.',
      },
    ],
    sources: ['https://react.dev/learn/passing-data-deeply-with-context'],
    quiz: {
      question: 'Context 값이 바뀔 때 다시 그려지는 것은 무엇인가',
      options: [
        'Provider 아래 모든 컴포넌트',
        '`useContext`로 그 값을 읽는 컴포넌트',
        'Provider 자신만',
      ],
      answerIndex: 1,
      explanation:
        '읽는 쪽이 다시 그려진다. 중간에 끼어 있기만 한 컴포넌트는 영향을 받지 않는다.',
    },
  },
  {
    id: 'reducer-context',
    chapter: '3',
    order: 24,
    title: 'reducer와 Context로 확장하기',
    tagline: '상태와 보내는 길을 함께 내놓는다',
    kind: 'practice',
    definition:
      'reducer로 바꾸는 방법을 모으고, Context로 state와 dispatch를 트리 아래에 내놓는다. 둘을 Context 두 개로 나누면, dispatch만 쓰는 컴포넌트는 state가 바뀌어도 다시 그려지지 않는다.',
    goal: '챕터 3의 마지막 모습이다. 필터와 목록과 입력칸이 props 없이 각자 필요한 것만 가져간다.',
    starterCode: `const TodosContext = createContext(null)
const DispatchContext = createContext(null)

let nextId = 4

function todosReducer(todos, action) {
  switch (action.type) {
    case 'added':
      return [...todos, { id: 'n' + nextId++, title: action.title, done: false }]
    case 'toggled':
      return todos.map((todo) =>
        todo.id === action.id ? { ...todo, done: !todo.done } : todo,
      )
    case 'deleted':
      return todos.filter((todo) => todo.id !== action.id)
    default:
      throw new Error('모르는 action: ' + action.type)
  }
}

function FilterBar({ filter, onChange }) {
  const todos = useContext(TodosContext)
  const left = todos.filter((todo) => !todo.done).length

  return (
    <div>
      <button onClick={() => onChange('all')} disabled={filter === 'all'}>
        전체 {todos.length}
      </button>
      <button onClick={() => onChange('left')} disabled={filter === 'left'}>
        남은 것 {left}
      </button>
      <button onClick={() => onChange('done')} disabled={filter === 'done'}>
        끝낸 것 {todos.length - left}
      </button>
    </div>
  )
}

function TodoCard({ todo }) {
  const dispatch = useContext(DispatchContext)

  return (
    <li>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={() => dispatch({ type: 'toggled', id: todo.id })}
      />
      <span>{todo.title}</span>
      {todo.done && <em> · 끝</em>}
      <button onClick={() => dispatch({ type: 'deleted', id: todo.id })}>지우기</button>
    </li>
  )
}

function TodoList({ filter }) {
  const todos = useContext(TodosContext)
  const shown =
    filter === 'left' ? todos.filter((todo) => !todo.done)
    : filter === 'done' ? todos.filter((todo) => todo.done)
    : todos

  if (shown.length === 0) return <p>여기 보여줄 것이 없다</p>

  return (
    <ul>
      {shown.map((todo) => (
        <TodoCard key={todo.id} todo={todo} />
      ))}
    </ul>
  )
}

function AddForm() {
  // todos는 안 읽는다. 보내는 길만 가져간다.
  const dispatch = useContext(DispatchContext)
  const [draft, setDraft] = useState('')

  return (
    <div>
      <input value={draft} placeholder="새 할 일" onChange={(e) => setDraft(e.target.value)} />
      <button
        onClick={() => {
          if (draft.trim() === '') return
          dispatch({ type: 'added', title: draft })
          setDraft('')
        }}
      >
        추가
      </button>
    </div>
  )
}

function App() {
  const [todos, dispatch] = useReducer(todosReducer, [
    { id: 'a', title: '장보기', done: true },
    { id: 'b', title: '설거지', done: false },
    { id: 'c', title: '빨래', done: false },
  ])
  const [filter, setFilter] = useState('all')

  return (
    <TodosContext.Provider value={todos}>
      <DispatchContext.Provider value={dispatch}>
        <section>
          <h2>할 일</h2>
          <FilterBar filter={filter} onChange={setFilter} />
          <TodoList filter={filter} />
          <AddForm />
        </section>
      </DispatchContext.Provider>
    </TodosContext.Provider>
  )
}
`,
    deeper: [
      {
        question: 'Context를 하나로 합쳐 `{ todos, dispatch }`를 담으면 무엇이 달라지는가',
        answer:
          '객체를 매 렌더에 새로 만들면 값이 매번 달라진다. dispatch만 쓰는 AddForm도 todos가 바뀔 때마다 함께 다시 그려진다. 둘을 나눠 두면 dispatch Context는 바뀌지 않는다.',
      },
      {
        question: 'filter는 왜 Context에 넣지 않았는가',
        answer:
          '필요한 곳이 둘뿐이고 둘 다 App의 바로 아래에 있다. Context는 멀리 보내야 할 때 쓴다. 가까우면 props가 읽기 쉽다.',
      },
      {
        question: '이 구조를 파일로 나누면 어떻게 두는가',
        answer:
          'reducer와 Context와 Provider 컴포넌트를 한 파일에 두고, 쓰는 쪽은 그 파일에서 훅 두 개만 가져가게 한다. `useTodos()`와 `useTodosDispatch()`를 그 파일이 내보내는 식이다. 레슨 32가 그 이야기다.',
      },
    ],
    sources: ['https://react.dev/learn/scaling-up-with-reducer-and-context'],
    quiz: {
      question: 'state와 dispatch를 Context 두 개로 나누는 이유는 무엇인가',
      options: [
        '리액트가 Context 하나에 값 하나만 허용하기 때문이다',
        'dispatch만 쓰는 컴포넌트가 state가 바뀔 때 함께 다시 그려지지 않게 하려고',
        '코드가 짧아지기 때문이다',
      ],
      answerIndex: 1,
      explanation:
        '두 값을 한 객체에 담으면 매 렌더에 새 객체가 되어, dispatch만 읽는 곳도 함께 다시 그려진다.',
    },
  },
]
