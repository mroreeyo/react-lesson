export default [
  {
    id: 'ref-value',
    chapter: '4',
    order: 25,
    title: 'ref로 값 참조하기',
    tagline: '화면과 상관없는 값을 들고 있는다',
    kind: 'practice',
    definition:
      'useRef는 렌더 사이에 남지만 바꿔도 다시 그리지 않는 칸을 준다. 화면에 나오지 않는 값을 둘 자리다.',
    goal: '챕터 3에서 모듈 바깥에 두었던 nextId를 컴포넌트 안으로 들인다. 다시 그릴 이유가 없는 값이라 ref에 둔다. reducer는 번호를 만들지 않고 받기만 한다.',
    starterCode: `function todosReducer(todos, action) {
  switch (action.type) {
    case 'added':
      return [...todos, { id: action.id, title: action.title, done: false }]
    default:
      throw new Error('모르는 action: ' + action.type)
  }
}

function App() {
  const [todos, dispatch] = useReducer(todosReducer, [{ id: 'a', title: '장보기', done: false }])
  const [draft, setDraft] = useState('')

  // 다음에 쓸 번호. 화면에 나오지 않으니 바뀌어도 다시 그릴 이유가 없다.
  const nextId = useRef(2)

  function add() {
    if (draft.trim() === '') return
    dispatch({ type: 'added', id: 'n' + nextId.current, title: draft })
    nextId.current = nextId.current + 1
    setDraft('')
  }

  return (
    <section>
      <h2>할 일 {todos.length}개</h2>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            {todo.title} <small>({todo.id})</small>
          </li>
        ))}
      </ul>
      <input value={draft} placeholder="새 할 일" onChange={(e) => setDraft(e.target.value)} />
      <button onClick={add}>추가</button>
    </section>
  )
}
`,
    demo: 'state-ref',
    deeper: [
      {
        question: 'ref 대신 보통 변수를 쓰면 안 되는가',
        answer:
          '컴포넌트 함수 안의 변수는 렌더마다 새로 만들어진다. 다음 렌더에 값이 사라진다. 챕터 3처럼 모듈 바깥에 두면 남지만, 그 컴포넌트를 두 군데 그리면 두 자리가 같은 변수를 나눠 쓰게 된다.',
      },
      {
        question: '번호를 reducer 안에서 만들면 안 되는가',
        answer:
          'reducer는 같은 입력에 같은 결과를 돌려줘야 한다. 안에서 번호를 올리면 부를 때마다 결과가 달라진다. 번호는 핸들러에서 만들어 action에 실어 보내고, reducer는 받은 것을 쓴다.',
      },
      {
        question: '렌더 중에 ref를 읽거나 쓰면 안 되는 이유',
        answer:
          '레슨 10의 순수성이 깨진다. 같은 props로 그렸는데 화면이 달라진다. 읽고 쓰는 곳은 이벤트 핸들러나 Effect 안이다.',
      },
      {
        question: 'ref에 담기 좋은 것들',
        answer:
          '타이머 id, 이전 값, 스크롤 위치처럼 화면에 직접 나오지 않고 렌더 사이에 남아야 하는 값이다. 화면에 보이는 값이면 state다.',
      },
    ],
    sources: ['https://react.dev/learn/referencing-values-with-refs'],
    quiz: {
      question: '`ref.current`를 바꾸면 무엇이 일어나는가',
      options: [
        '컴포넌트가 다시 그려진다',
        '값만 바뀌고 다시 그리지 않는다',
        '다음 렌더에서 초기값으로 돌아간다',
      ],
      answerIndex: 1,
      explanation:
        '값은 남고 화면은 그대로다. 그래서 화면에 보여야 하는 값이면 ref가 아니라 state에 둔다.',
    },
  },
  {
    id: 'ref-dom',
    chapter: '4',
    order: 26,
    title: 'ref로 DOM 조작하기',
    tagline: '리액트가 만든 요소를 직접 만진다',
    kind: 'practice',
    definition:
      '`ref`를 태그에 주면 리액트가 커밋할 때 그 DOM 요소(브라우저가 실제로 들고 있는 요소)를 `ref.current`에 넣어 준다. 그리는 동안에는 아직 비어 있으니(null) 핸들러나 Effect에서 읽는다. 포커스나 스크롤처럼 JSX로 표현할 수 없는 일을 할 때 쓴다.',
    goal: '추가한 다음 입력칸에 커서가 저절로 간다.',
    starterCode: `function todosReducer(todos, action) {
  switch (action.type) {
    case 'added':
      return [...todos, { id: action.id, title: action.title, done: false }]
    default:
      throw new Error('모르는 action: ' + action.type)
  }
}

function App() {
  const [todos, dispatch] = useReducer(todosReducer, [{ id: 'a', title: '장보기', done: false }])
  const [draft, setDraft] = useState('')
  const nextId = useRef(2)

  // 커밋 후 리액트가 여기에 실제 input 요소를 넣어 준다.
  const inputRef = useRef(null)

  function add() {
    if (draft.trim() === '') return
    dispatch({ type: 'added', id: 'n' + nextId.current, title: draft })
    nextId.current = nextId.current + 1
    setDraft('')
    inputRef.current.focus()
  }

  return (
    <section>
      <h2>할 일 {todos.length}개</h2>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
      <input
        ref={inputRef}
        value={draft}
        placeholder="적고 추가를 누르세요"
        onChange={(e) => setDraft(e.target.value)}
      />
      <button onClick={add}>추가</button>
      <button onClick={() => inputRef.current.focus()}>입력칸으로</button>
    </section>
  )
}
`,
    deeper: [
      {
        question: '렌더 중에 `ref.current`를 읽으면 왜 null인가',
        answer:
          '리액트가 요소를 넣어 주는 시점은 커밋 뒤다. 첫 렌더에서는 아직 화면에 붙지 않았으므로 null이다. 이벤트 핸들러나 Effect에서 읽어야 값이 있다.',
      },
      {
        question: 'DOM을 직접 만져도 되는 선은 어디인가',
        answer:
          '리액트가 관리하지 않는 일까지다. 포커스, 스크롤, 크기 재기, 미디어 재생은 괜찮다. 리액트가 그린 자식을 직접 지우거나 텍스트를 바꾸면 리액트가 알고 있는 화면과 어긋난다.',
      },
      {
        question: '다른 컴포넌트의 DOM을 만지려면',
        answer:
          '그 컴포넌트가 `ref`를 받아 안쪽 태그에 넘겨줘야 한다. 리액트 19부터는 `ref`를 다른 prop처럼 받을 수 있다. 레슨 34가 그 이야기다.',
      },
    ],
    sources: ['https://react.dev/learn/manipulating-the-dom-with-refs'],
    quiz: {
      question: '첫 렌더가 도는 중에 `inputRef.current`는 무엇인가',
      options: ['input 요소', 'null', '빈 객체'],
      answerIndex: 1,
      explanation:
        'null이다. 리액트는 화면에 붙인 다음(커밋 후) 요소를 넣어 준다. 그래서 핸들러나 Effect에서 읽는다.',
    },
  },
  {
    id: 'effect',
    chapter: '4',
    order: 27,
    title: 'Effect로 동기화하기',
    tagline: '바깥 시스템을 화면 상태에 맞춰 둔다',
    kind: 'practice',
    definition:
      'useEffect는 렌더가 화면에 반영된 뒤에 돈다. 리액트 바깥에 있는 것을 지금 state에 맞춰 두는 자리다. 두 번째 인자인 의존성 배열에 적은 값이 지난번과 달라지면 다시 돌고, 빈 배열이면 처음 한 번만 돈다.',
    goal: '새로고침해도 할 일이 남는다. 목록이 바뀔 때마다 브라우저 저장소에 맞춰 둔다.',
    starterCode: `const KEY = 'todo-demo:v1'
const INITIAL = [{ id: 'a', title: '장보기', done: false }]

function todosReducer(todos, action) {
  switch (action.type) {
    case 'added':
      return [...todos, { id: action.id, title: action.title, done: false }]
    case 'cleared':
      return []
    default:
      throw new Error('모르는 action: ' + action.type)
  }
}

// 저장소에서 처음 값을 읽는다. 없거나 막혀 있으면 INITIAL이다.
function load(key) {
  try {
    const raw = localStorage.getItem(key)
    return raw === null ? INITIAL : JSON.parse(raw)
  } catch {
    return INITIAL
  }
}

function App() {
  // 세 번째 인자는 처음 한 번만 불린다. 매 렌더마다 저장소를 읽지 않는다.
  const [todos, dispatch] = useReducer(todosReducer, KEY, load)
  const [draft, setDraft] = useState('')
  const nextId = useRef(100)

  // todos가 바뀔 때마다 저장소를 지금 상태에 맞춘다.
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(todos))
    } catch {
      // 저장이 막힌 브라우저에서도 앱은 그대로 돈다
    }
  }, [todos])

  function add() {
    if (draft.trim() === '') return
    dispatch({ type: 'added', id: 'n' + nextId.current, title: draft })
    nextId.current = nextId.current + 1
    setDraft('')
  }

  return (
    <section>
      <h2>할 일 {todos.length}개</h2>
      <p>결과 패널을 다시 실행해도 남아 있다. 편집기 코드를 아무렇게나 한 글자 고쳐 보세요.</p>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
      <input value={draft} placeholder="새 할 일" onChange={(e) => setDraft(e.target.value)} />
      <button onClick={add}>추가</button>
      <button onClick={() => dispatch({ type: 'cleared' })}>비우기</button>
    </section>
  )
}
`,
    before: {
      text: '화면에 붙었을 때, 값이 바뀌었을 때, 떼어질 때 세 군데에 코드를 나눠 적었다. 채팅방에 연결하는 일처럼 원래 한 덩어리인 작업도 세 곳에 흩어졌다.',
      code: `// 안 읽어도 된다. 같은 일이 세 자리에 흩어진 것만 보면 된다.
class ChatRoom extends React.Component {
  componentDidMount() {                           // 1. 화면에 붙었을 때 한 번
    this.connection = createConnection(this.props.roomId)
    this.connection.connect()                     //    연결을 연다
  }

  componentDidUpdate(prevProps) {                 // 2. 값이 바뀔 때마다
    if (prevProps.roomId !== this.props.roomId) { //    무엇이 바뀌었는지는 손으로 비교
      this.connection.disconnect()                //    끊고
      this.connection = createConnection(this.props.roomId)
      this.connection.connect()                   //    다시 연다
    }
  }

  componentWillUnmount() {                        // 3. 화면에서 떼어질 때
    this.connection.disconnect()                  //    닫는다
  }
}
`,
    },
    why: [
      '연결을 여는 코드와 닫는 코드가 서로 멀리 떨어져 있었다. 한 곳만 고치고 나머지를 빠뜨리기 쉬웠고, componentDidUpdate에서 "뭐가 바뀌었는지" 비교하는 코드를 손으로 적어야 했다.',
      'useEffect는 시점을 세는 대신 한 가지 일로 묶는다. 이 컴포넌트가 화면에 있는 동안 바깥 시스템을 이 상태에 맞춰 둔다는 것이다. 여는 코드와 닫는 코드가 한 함수 안에 붙어 있어서, 값이 바뀌면 이전 것이 먼저 닫힌다.',
    ],
    deeper: [
      {
        question: '의존성 배열은 무엇을 정하는가',
        answer:
          '언제 다시 맞출지를 정한다. 배열 안의 값이 지난번과 달라지면 Effect를 다시 돈다. 빈 배열이면 처음 한 번만, 배열을 아예 안 주면 매 렌더마다 돈다.',
      },
      {
        question: 'useReducer의 세 번째 인자는 무엇인가',
        answer:
          '처음 state를 만드는 함수다. 두 번째 인자를 받아 state를 돌려준다. 저장소를 읽는 것처럼 비용이 있는 초기화를 매 렌더가 아니라 처음 한 번만 하려고 쓴다. useState도 함수를 넘기면 같은 일을 한다.',
      },
      {
        question: '왜 Effect는 커밋 뒤에 도는가',
        answer:
          '렌더 중에 바깥을 건드리면 순수성이 깨진다. 그리고 화면에 붙기 전이라 크기를 재거나 포커스를 줄 대상도 아직 없다.',
      },
    ],
    sources: ['https://react.dev/learn/synchronizing-with-effects'],
    quiz: {
      question: 'useEffect의 의존성 배열이 정하는 것은 무엇인가',
      options: [
        'Effect 안에서 쓸 수 있는 변수의 목록',
        '언제 Effect를 다시 돌릴지',
        'Effect가 도는 순서',
      ],
      answerIndex: 1,
      explanation:
        '배열 안의 값이 지난 렌더와 달라지면 다시 돈다. 무엇을 쓸 수 있는지를 제한하는 것이 아니다.',
    },
  },
  {
    id: 'no-effect',
    chapter: '4',
    order: 28,
    broken: true,
    title: 'Effect가 필요 없는 경우',
    tagline: '계산으로 되는 일에 Effect를 쓰지 않는다',
    kind: 'practice',
    definition:
      'Effect는 리액트 바깥과 맞출 때 쓴다. props나 state로 계산할 수 있는 값이면 렌더 중에 계산한다.',
    goal: '이 코드는 Effect로 남은 개수를 state에 넣고 있다. 한 박자 늦게 그려진다. Effect와 state를 지우고 계산으로 바꾼다.',
    starterCode: `function todosReducer(todos, action) {
  switch (action.type) {
    case 'toggled':
      return todos.map((todo) =>
        todo.id === action.id ? { ...todo, done: !todo.done } : todo,
      )
    default:
      throw new Error('모르는 action: ' + action.type)
  }
}

function App() {
  const [todos, dispatch] = useReducer(todosReducer, [
    { id: 'a', title: '장보기', done: true },
    { id: 'b', title: '설거지', done: false },
  ])

  // 필요 없는 Effect다. todos로 바로 계산할 수 있다.
  const [left, setLeft] = useState(0)
  useEffect(() => {
    setLeft(todos.filter((todo) => !todo.done).length)
  }, [todos])

  return (
    <section>
      <h2>할 일 {todos.length}개</h2>
      <p>남은 것 {left}개</p>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() => dispatch({ type: 'toggled', id: todo.id })}
            />
            <span>{todo.title}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
`,
    deeper: [
      {
        question: '왜 한 박자 늦는가',
        answer:
          'todos가 바뀌면 먼저 화면이 그려지고, 그 다음에 Effect가 돌아 setLeft를 부르고, 그래서 또 한 번 그려진다. 중간에 예전 숫자가 보이는 프레임이 생긴다. 계산으로 두면 렌더가 한 번이다.',
      },
      {
        question: 'Effect를 쓰지 않아야 하는 다른 경우들',
        answer:
          '사용자의 클릭에 반응하는 일은 이벤트 핸들러에 둔다. props가 바뀔 때 state를 초기화하는 일은 key로 한다(레슨 21). 데이터를 미리 계산해 두는 일은 렌더 중 계산이나 useMemo다.',
      },
      {
        question: '그럼 Effect는 언제 쓰는가',
        answer:
          '리액트가 모르는 것과 맞출 때다. 브라우저 저장소, 타이머, 구독, 외부 위젯, 네트워크 연결처럼 리액트 바깥에 있는 것들이다.',
      },
    ],
    sources: ['https://react.dev/learn/you-might-not-need-an-effect'],
    quiz: {
      question: 'props로 계산할 수 있는 값을 Effect로 state에 넣으면 무엇이 생기는가',
      options: [
        '값이 정확해진다',
        '렌더가 한 번 더 돌고, 중간에 예전 값이 보이는 순간이 생긴다',
        '리액트가 오류를 낸다',
      ],
      answerIndex: 1,
      explanation:
        '그리고 나서 Effect가 돌고 다시 그린다. 계산으로 두면 한 번에 맞는 값이 나온다.',
    },
  },
  {
    id: 'effect-lifecycle',
    chapter: '4',
    order: 29,
    title: '반응형 Effect의 생명주기',
    tagline: '시작하고 멈추는 한 덩어리',
    kind: 'practice',
    definition:
      'Effect는 화면에 붙고 떼어지는 시점(마운트·언마운트)이 아니라 "맞추기 시작"과 "맞추기 멈춤"으로 생각한다. 의존성이 바뀌면 리액트가 먼저 멈추고 다시 시작한다.',
    goal: '바깥에서 오는 신호를 계속 받는 것을 구독이라 한다. 필터를 바꿀 때마다 이전 구독이 닫히고 새 구독이 열리는 것을 기록으로 본다.',
    starterCode: `// 리액트 바깥에 있는 것을 흉내낸 가짜 구독
function createFeed(filter) {
  let timer = null
  return {
    open(onEvent) {
      onEvent('열림: ' + filter)
      timer = setInterval(() => onEvent('갱신: ' + filter), 2000)
    },
    close(onEvent) {
      clearInterval(timer)
      onEvent('닫힘: ' + filter)
    },
  }
}

function App() {
  const [filter, setFilter] = useState('all')
  const [log, setLog] = useState([])

  useEffect(() => {
    const push = (line) => setLog((prev) => [...prev, line])
    const feed = createFeed(filter)
    feed.open(push)
    // 멈추는 코드가 시작하는 코드 바로 아래에 붙어 있다
    return () => feed.close(push)
  }, [filter])

  return (
    <section>
      <div>
        {['all', 'left', 'done'].map((name) => (
          <button key={name} onClick={() => setFilter(name)} disabled={filter === name}>
            {name}
          </button>
        ))}
        <button onClick={() => setLog([])}>기록 비우기</button>
      </div>
      <p>지금 맞추는 대상: {filter}</p>
      <ol>
        {log.map((line, i) => (
          <li key={i}>{line}</li>
        ))}
      </ol>
    </section>
  )
}
`,
    deeper: [
      {
        question: 'cleanup을 안 적으면 무엇이 남는가',
        answer:
          '필터를 세 번 바꾸면 구독이 세 개 살아 있다. 위 코드의 setInterval이 셋 다 돌면서 기록이 뒤섞인다. 화면에서 사라진 컴포넌트가 계속 일하는 상태다.',
      },
      {
        question: '의존성에서 filter를 빼면 무엇이 깨지는가',
        answer:
          '처음 한 번만 구독하고, 이후 filter가 바뀌어도 첫 값에 계속 맞춘다. Effect 안에서 읽는 값은 의존성에 들어가야 한다. 빠뜨린 값은 옛 값으로 고정된다.',
      },
      {
        question: '"마운트에 한 번"이라고 생각하면 왜 위험한가',
        answer:
          '그 관점으로는 의존성 배열이 귀찮은 규칙처럼 보인다. "이 값에 맞춰 둔다"로 보면, 값이 바뀌면 다시 맞추는 것이 당연해진다.',
      },
    ],
    sources: ['https://react.dev/learn/lifecycle-of-reactive-effects'],
    quiz: {
      question: '의존성에 있는 값이 바뀌면 리액트는 무엇을 하는가',
      options: [
        'Effect를 한 번 더 돌린다',
        'cleanup을 먼저 돌려 이전 것을 멈추고, 그다음 Effect를 다시 돌린다',
        '컴포넌트를 다시 만든다',
      ],
      answerIndex: 1,
      explanation:
        '멈추고 다시 시작한다. 그래서 여는 코드와 닫는 코드를 한 Effect 안에 짝으로 두는 것이 중요하다.',
    },
  },
  {
    id: 'effect-event',
    chapter: '4',
    order: 30,
    title: 'Effect에서 이벤트 분리하기',
    tagline: '다시 맞출 값과 읽기만 할 값',
    kind: 'practice',
    definition:
      'Effect 안의 코드 중 일부는 "값이 바뀌면 다시 해야 하는 일"이고, 일부는 "그때그때 최신 값을 읽기만 하는 일"이다. 뒤쪽은 useEffectEvent로 떼어 내면 의존성에서 빠진다.',
    goal: '알림 문구를 바꿔도 구독이 다시 열리지 않는다. 필터를 바꿀 때만 다시 열린다.',
    starterCode: `function createFeed(filter) {
  let timer = null
  return {
    open(onEvent) {
      onEvent('열림: ' + filter)
      timer = setInterval(() => onEvent('갱신'), 2500)
    },
    close() {
      clearInterval(timer)
    },
  }
}

function App() {
  const [filter, setFilter] = useState('all')
  const [prefix, setPrefix] = useState('[알림]')
  const [log, setLog] = useState([])

  // prefix를 읽지만, prefix가 바뀌었다고 구독을 다시 열 이유는 없다.
  const onEvent = useEffectEvent((line) => {
    setLog((prev) => [...prev, prefix + ' ' + line])
  })

  useEffect(() => {
    const feed = createFeed(filter)
    feed.open(onEvent)
    return () => feed.close()
  }, [filter]) // prefix는 여기 없다

  return (
    <section>
      <div>
        {['all', 'left', 'done'].map((name) => (
          <button key={name} onClick={() => setFilter(name)} disabled={filter === name}>
            {name}
          </button>
        ))}
      </div>
      <input value={prefix} onChange={(e) => setPrefix(e.target.value)} />
      <p>맞추는 대상 {filter} · 문구 {prefix}</p>
      <button onClick={() => setLog([])}>기록 비우기</button>
      <ol>
        {log.map((line, i) => (
          <li key={i}>{line}</li>
        ))}
      </ol>
    </section>
  )
}
`,
    deeper: [
      {
        question: 'prefix를 의존성에 넣으면 무엇이 달라지는가',
        answer:
          '문구를 한 글자 칠 때마다 구독이 닫히고 다시 열린다. 실제 연결이라면 글자 하나에 재접속이 일어난다. 읽기만 하는 값 때문에 다시 맞추는 것은 원한 동작이 아니다.',
      },
      {
        question: '그럼 의존성에서 빼기만 하면 되지 않는가',
        answer:
          '빼면 prefix가 첫 값으로 고정된다. 문구를 바꿔도 기록에는 예전 문구가 붙는다. useEffectEvent로 뗀 함수는 불릴 때마다 최신 값을 읽으므로 그 문제가 없다.',
      },
      {
        question: '이 훅은 언제부터 쓸 수 있는가',
        answer:
          '오래 실험 단계에 있다가 React 19.2에서 정식으로 들어왔다. 그 전에는 ref에 최신 함수를 넣어 두는 방법을 손으로 만들어 썼다.',
      },
    ],
    sources: ['https://react.dev/learn/separating-events-from-effects'],
    quiz: {
      question: 'useEffectEvent로 뗀 함수의 특징은 무엇인가',
      options: [
        '의존성에 넣지 않아도 되고, 불릴 때 최신 값을 읽는다',
        '매 렌더마다 새로 만들어진다',
        'Effect 밖에서도 아무 데서나 부를 수 있다',
      ],
      answerIndex: 0,
      explanation:
        '반응하지 않는 함수다. 값이 바뀌어도 Effect를 다시 돌리지 않지만, 불리는 순간에는 최신 값을 본다.',
    },
  },
  {
    id: 'remove-deps',
    chapter: '4',
    order: 31,
    broken: true,
    title: 'Effect 의존성 제거하기',
    tagline: '코드를 고쳐서 의존성을 줄인다',
    kind: 'practice',
    definition:
      '의존성은 고르는 것이 아니라 Effect 코드에서 따라 나온다. 줄이고 싶으면 배열을 손보지 않고 코드를 고친다.',
    goal: '지금 이 Effect는 옵션 객체 때문에 매 렌더마다 다시 돈다. 내용이 같아도 렌더마다 새 객체라서 리액트는 달라졌다고 본다. 한 번만 열려야 하는데 12번 열린다. 객체를 Effect 안으로 옮겨 한 번으로 만든다.',
    starterCode: `const LIMIT = 12

function createFeed(options) {
  let timer = null
  return {
    open(onEvent) {
      onEvent('열림: ' + options.filter)
      timer = setInterval(() => onEvent('갱신'), 3000)
    },
    close() {
      clearInterval(timer)
    },
  }
}

function App() {
  const [filter, setFilter] = useState('all')
  const [log, setLog] = useState([])

  // 렌더마다 새 객체가 만들어진다. 내용은 같지만 지난번과 다른 객체다.
  const options = { filter: filter }

  useEffect(() => {
    // 기록이 LIMIT에 닿으면 멈춘다. 이 제동장치가 없으면 끝없이 돈다.
    const push = (line) => setLog((prev) => (prev.length >= LIMIT ? prev : [...prev, line]))
    const feed = createFeed(options)
    feed.open(push)
    return () => feed.close()
  }, [options])

  return (
    <section>
      <div>
        {['all', 'left', 'done'].map((name) => (
          <button key={name} onClick={() => setFilter(name)} disabled={filter === name}>
            {name}
          </button>
        ))}
        <button onClick={() => setLog([])}>기록 비우기</button>
      </div>
      <p>
        열린 횟수 {log.length}
        {log.length >= LIMIT && ' (제동장치가 막았다. 원래는 안 멈춘다)'}
      </p>
      <ol>
        {log.map((line, i) => (
          <li key={i}>{line}</li>
        ))}
      </ol>
    </section>
  )
}
`,
    deeper: [
      {
        question: '왜 계속 다시 도는가',
        answer:
          'Effect가 setLog를 불러 다시 그려지고, 그리면서 새 options 객체가 만들어지고, 그 객체가 지난번과 다르니 Effect가 또 돈다. 객체와 함수는 내용이 같아도 매번 다른 값이다.',
      },
      {
        question: 'LIMIT은 왜 있는가',
        answer:
          '없으면 이 예제가 탭을 멈춘다. 이 레슨에서만 쓰는 제동장치이고, 실제 코드에서 이런 것을 달아 문제를 가리면 안 된다. 고칠 것은 의존성이다.',
      },
      {
        question: '의존성 배열에서 빼기만 하면 안 되는가',
        answer:
          '경고는 사라지고 버그는 남는다. 배열은 "무엇을 읽는지"를 적는 곳이지 "언제 돌릴지"를 고르는 곳이 아니다. 줄이려면 읽는 것을 줄여야 한다.',
      },
      {
        question: '함수가 의존성에 걸릴 때는 어떻게 하는가',
        answer:
          'Effect 안으로 옮기거나, 컴포넌트 밖으로 꺼낸다. 밖에서 만든 함수는 렌더와 상관없으므로 매번 같은 값이다. 이벤트성 코드라면 레슨 30의 방법을 쓴다.',
      },
    ],
    sources: ['https://react.dev/learn/removing-effect-dependencies'],
    quiz: {
      question: '렌더 중에 만든 객체를 의존성에 넣으면 왜 매번 다시 도는가',
      options: [
        '리액트가 객체를 깊게 비교하기 때문이다',
        '내용이 같아도 렌더마다 다른 객체이고, 리액트는 얕게 비교하기 때문이다',
        '객체는 의존성에 넣을 수 없기 때문이다',
      ],
      answerIndex: 1,
      explanation:
        '`{ filter: "all" }`과 `{ filter: "all" }`은 다른 객체다. 얕은 비교로는 매번 달라진 것으로 보인다.',
    },
  },
  {
    id: 'custom-hooks',
    chapter: '4',
    order: 32,
    title: '커스텀 훅으로 로직 재사용하기',
    tagline: '훅을 쓰는 함수를 내가 만든다',
    kind: 'practice',
    definition:
      '`use`로 시작하는 함수 안에서 훅을 부르면 커스텀 훅이다. 로직만 떼어 여러 컴포넌트가 가져다 쓸 수 있고, state는 쓰는 쪽마다 따로 생긴다.',
    goal: '챕터 4의 마지막 모습이다. reducer와 저장을 useTodos로, 포커스를 useAutoFocus로 떼어 낸다. App에는 화면만 남는다.',
    starterCode: `const INITIAL = [{ id: 'a', title: '장보기', done: false }]

function todosReducer(todos, action) {
  switch (action.type) {
    case 'added':
      return [...todos, { id: action.id, title: action.title, done: false }]
    case 'toggled':
      return todos.map((todo) =>
        todo.id === action.id ? { ...todo, done: !todo.done } : todo,
      )
    case 'cleared':
      return []
    default:
      throw new Error('모르는 action: ' + action.type)
  }
}

function load(key) {
  try {
    const raw = localStorage.getItem(key)
    return raw === null ? INITIAL : JSON.parse(raw)
  } catch {
    return INITIAL
  }
}

// 할 일 목록의 상태와 저장을 한 덩어리로 묶은 훅. 챕터 3의 reducer와 27의 Effect가 여기로 들어왔다.
function useTodos(key) {
  const [todos, dispatch] = useReducer(todosReducer, key, load)

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(todos))
    } catch {
      // 저장이 막혀도 앱은 그대로 돈다
    }
  }, [key, todos])

  return [todos, dispatch]
}

// 화면에 붙을 때 한 번 포커스를 주는 훅
function useAutoFocus() {
  const ref = useRef(null)
  useEffect(() => {
    ref.current.focus()
  }, [])
  return ref
}

function TodoCard({ todo, dispatch }) {
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

function App() {
  const [todos, dispatch] = useTodos('todo-demo:v2')
  const [draft, setDraft] = useState('')
  const nextId = useRef(100)
  const inputRef = useAutoFocus()

  const left = todos.filter((todo) => !todo.done).length

  function add() {
    if (draft.trim() === '') return
    dispatch({ type: 'added', id: 'n' + nextId.current, title: draft })
    nextId.current = nextId.current + 1
    setDraft('')
    inputRef.current.focus()
  }

  return (
    <section>
      <h2>할 일 {todos.length}개</h2>
      <p>{left === 0 ? '다 끝났다' : '남은 것 ' + left + '개'}</p>
      <ul>
        {todos.map((todo) => (
          <TodoCard key={todo.id} todo={todo} dispatch={dispatch} />
        ))}
      </ul>
      <input
        ref={inputRef}
        value={draft}
        placeholder="새 할 일"
        onChange={(e) => setDraft(e.target.value)}
      />
      <button onClick={add}>추가</button>
      <button onClick={() => dispatch({ type: 'cleared' })}>비우기</button>
    </section>
  )
}
`,
    before: {
      text: '창 크기 구독처럼 같은 로직을 여러 컴포넌트에서 쓰려면, 컴포넌트를 감싸는 컴포넌트를 따로 만들어 끼웠다. 감싸는 쪽이 값을 들고 있다가 props로 내려 줬다.',
      code: `// 안 읽어도 된다. 로직을 나누려고 컴포넌트를 한 겹 더 만든 것만 보면 된다.
function withWindowWidth(Inner) {                 // Inner를 감싸는 새 컴포넌트를 만들어 돌려준다
  return class extends React.Component {          // 값을 들고 있어야 해서 class다
    state = { width: window.innerWidth }          // 창 너비를 기억

    componentDidMount() {                         // 붙었을 때 구독 시작
      this.onResize = () => this.setState({ width: window.innerWidth })
      window.addEventListener('resize', this.onResize)
    }

    componentWillUnmount() {                      // 떼어질 때 구독 해제
      window.removeEventListener('resize', this.onResize)
    }

    render() {                                    // 안쪽 컴포넌트에 width를 props로 내려 준다
      return <Inner {...this.props} width={this.state.width} />
    }
  }
}

// 세 겹으로 감쌌다. 트리에 껍데기가 세 층 생긴다.
export default withWindowWidth(withTheme(withRouter(TodoList)))
`,
    },
    why: [
      '감싸는 층이 겹겹이 쌓여 트리가 깊어졌다. 개발자 도구를 열면 내가 만든 컴포넌트를 찾기 위해 껍데기를 몇 겹 내려가야 했고, props가 어디서 온 것인지 추적하기 어려웠다.',
      '문제는 로직만 떼어 갈 방법이 없었다는 것이다. state와 생명주기를 가질 수 있는 것이 컴포넌트뿐이었으니, 로직을 나누려면 컴포넌트를 만들 수밖에 없었다. 훅은 그 능력을 함수에 줘서, 껍데기 없이 로직만 가져간다.',
    ],
    deeper: [
      {
        question: '커스텀 훅을 두 컴포넌트가 쓰면 state를 나눠 쓰는가',
        answer:
          '아니다. 쓰는 쪽마다 따로 생긴다. 공유되는 것은 코드이고 값이 아니다. 값을 함께 쓰려면 state를 위로 올리거나 Context에 담는다.',
      },
      {
        question: '왜 이름이 `use`로 시작해야 하는가',
        answer:
          '리액트가 훅 규칙을 검사할 수 있게 하는 약속이다. `use`로 시작하지 않는 함수 안에서 훅을 부르면 규칙을 어긴 것을 잡아내지 못한다.',
      },
      {
        question: '무엇을 커스텀 훅으로 뺄지 어떻게 정하는가',
        answer:
          '훅을 부르는 코드 덩어리가 이름을 가질 만한 일 하나일 때다. `useTodos`는 "할 일 목록을 들고 저장소에 맞춰 둔다"는 한 가지 일이다. 코드를 줄이려고만 상관없는 일을 한 훅에 묶으면 나중에 쓰기 어려워진다.',
      },
      {
        question: '레슨 24의 Context는 어디로 갔는가',
        answer:
          '이 앱은 트리가 두 단계라 dispatch를 props로 한 번만 내리면 된다. Context는 거쳐 가는 컴포넌트가 여럿일 때 쓰는 것이다. 트리가 깊어지면 useTodos가 돌려준 값을 Provider에 담으면 되고, 그때 훅 이름은 그대로다.',
      },
    ],
    sources: ['https://react.dev/learn/reusing-logic-with-custom-hooks'],
    quiz: {
      question: '같은 커스텀 훅을 컴포넌트 둘이 쓰면 state는 어떻게 되는가',
      options: [
        '둘이 같은 state를 나눠 쓴다',
        '쓰는 쪽마다 따로 생긴다',
        '나중에 그려진 쪽이 앞의 값을 덮는다',
      ],
      answerIndex: 1,
      explanation:
        '공유되는 것은 로직이고 값이 아니다. 값을 함께 써야 하면 state를 올리거나 Context에 담는다.',
    },
  },
]
