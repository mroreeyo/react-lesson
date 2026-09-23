export default [
  {
    id: 'memo',
    chapter: '5',
    order: 33,
    title: '다시 그리기 줄이기: memo·useMemo·useCallback',
    tagline: '바뀐 게 없으면 건너뛴다',
    kind: 'practice',
    definition:
      'memo는 props가 같으면 컴포넌트를 다시 그리지 않는다. useMemo는 계산 결과를, useCallback은 함수를 렌더 사이에 붙들어 둔다. 셋 다 "지난번과 같은 값"을 만들어 memo가 건너뛸 수 있게 하는 도구다. 이렇게 결과를 기억해 두는 것을 메모이제이션이라 한다.',
    goal: '"부모만 다시 그리기"를 눌러도 카드의 렌더 횟수가 오르지 않는다. useCallback 줄을 지우고 다시 눌러 보면 오른다.',
    starterCode: `function useRenderCount() {
  const count = useRef(0)
  count.current += 1
  return count.current
}

// props가 지난번과 같으면 리액트가 이 함수를 부르지 않는다
const TodoCard = memo(function TodoCard({ todo, onToggle }) {
  const renders = useRenderCount()
  return (
    <li>
      <input type="checkbox" checked={todo.done} onChange={() => onToggle(todo.id)} />
      <span>{todo.title}</span>
      <small> 렌더 {renders}회</small>
    </li>
  )
})

function App() {
  const [todos, setTodos] = useState([
    { id: 'a', title: '장보기', done: true },
    { id: 'b', title: '설거지', done: false },
    { id: 'c', title: '빨래', done: false },
  ])
  const [tick, setTick] = useState(0)
  const appRenders = useRenderCount()

  // 이 줄이 없으면 렌더마다 새 함수가 만들어져 props가 달라지고, memo가 소용없어진다
  const toggle = useCallback((id) => {
    setTodos((prev) => prev.map((todo) => (todo.id === id ? { ...todo, done: !todo.done } : todo)))
  }, [])

  // todos가 그대로면 다시 세지 않는다
  const left = useMemo(() => todos.filter((todo) => !todo.done).length, [todos])

  return (
    <section>
      <h2>할 일 {todos.length}개 · 남은 것 {left}개</h2>
      <p>App 렌더 {appRenders}회</p>
      <button onClick={() => setTick(tick + 1)}>부모만 다시 그리기 ({tick})</button>
      <ul>
        {todos.map((todo) => (
          <TodoCard key={todo.id} todo={todo} onToggle={toggle} />
        ))}
      </ul>
    </section>
  )
}
`,
    demo: 'rerender',
    deeper: [
      {
        question: '왜 useCallback이 없으면 memo가 소용없는가',
        answer:
          '함수도 값이다. 렌더마다 `(id) => ...`를 새로 만들면 내용이 같아도 다른 함수다. memo는 props를 얕게 비교하므로 onToggle이 매번 달라진 것으로 보고 그린다. useCallback은 같은 함수를 돌려줘서 그 비교를 통과시킨다.',
      },
      {
        question: '전부 memo로 감싸면 되지 않는가',
        answer:
          '비교에도 비용이 든다. props가 자주 바뀌는 컴포넌트는 비교만 하고 결국 그린다. 느려서 재 본 곳에만 붙인다. 레슨 38의 컴파일러가 이 판단을 대신하려는 것이다.',
      },
      {
        question: 'toggle 안에서 todos 대신 prev를 쓴 이유',
        answer:
          '의존성 배열이 빈 배열이라 이 함수는 처음 렌더의 todos만 본다. 함수를 넘기면 리액트가 최신 값을 넣어 준다. 레슨 15의 그 방식이다.',
      },
    ],
    sources: ['https://react.dev/reference/react/memo'],
    quiz: {
      question: 'memo로 감싼 자식에게 매 렌더 새로 만든 함수를 props로 주면 어떻게 되는가',
      options: [
        'memo 덕분에 그리지 않는다',
        '함수가 매번 다른 값이라 memo가 통과시키지 못하고 매번 그린다',
        '리액트가 함수 내용을 비교해 같으면 건너뛴다',
      ],
      answerIndex: 1,
      explanation:
        '함수는 값이고 새로 만들면 다른 값이다. memo는 얕게 비교하므로 매번 다르다고 본다. useCallback으로 같은 함수를 유지해야 한다.',
    },
  },
  {
    id: 'ref-prop',
    chapter: '5',
    order: 34,
    title: 'ref를 prop으로 받기',
    tagline: 'ref도 이제 보통 prop이다',
    kind: 'practice',
    definition:
      'React 19부터 함수 컴포넌트는 `ref`를 다른 prop과 똑같이 받는다. 받은 ref를 안쪽 태그에 그대로 넘기면 부모가 그 요소를 만질 수 있다.',
    goal: '입력칸이 별도 컴포넌트인데도 부모가 포커스를 줄 수 있다.',
    starterCode: `// ref가 그냥 들어온다. 구조 분해로 꺼내서 태그에 넘긴다.
function TodoInput({ ref, value, onChange }) {
  return <input ref={ref} value={value} placeholder="새 할 일" onChange={onChange} />
}

function App() {
  const [todos, setTodos] = useState(['장보기'])
  const [draft, setDraft] = useState('')
  const inputRef = useRef(null)

  function add() {
    if (draft.trim() === '') return
    setTodos([...todos, draft])
    setDraft('')
    inputRef.current.focus()
  }

  return (
    <section>
      <ul>
        {todos.map((title, i) => (
          <li key={title + i}>{title}</li>
        ))}
      </ul>
      <TodoInput ref={inputRef} value={draft} onChange={(e) => setDraft(e.target.value)} />
      <button onClick={add}>추가</button>
      <button onClick={() => inputRef.current.focus()}>입력칸으로</button>
    </section>
  )
}
`,
    before: {
      text: '자식의 입력창을 직접 만지려면 그 컴포넌트를 forwardRef로 감쌌다. 컴포넌트마다 똑같은 껍데기 코드가 붙었다.',
      code: `// 안 읽어도 된다. 껍데기가 한 겹 있는 것만 보면 된다.
const TodoInput = forwardRef(function TodoInput(props, ref) {  // 두 번째 인자로 따로 받았다
  return <input ref={ref} {...props} />
})
`,
    },
    why: [
      'ref는 다른 prop과 달리 컴포넌트 함수에 들어오지 않았다. 리액트가 중간에서 가로챘기 때문이다. 그래서 자식에게 넘기려면 forwardRef라는 별도 통로가 필요했고, 입력창 하나를 감싼 컴포넌트마다 그 통로를 적어야 했다.',
      '19부터 ref는 props 객체에 그대로 들어온다. 통로가 필요 없어졌고, forwardRef는 남아 있지만 새로 쓸 이유가 없다.',
    ],
    deeper: [
      {
        question: 'ref는 왜 그동안 다른 prop과 달리 취급됐는가',
        answer:
          'key와 함께 리액트가 직접 쓰는 이름이었다. key는 "어느 항목인가", ref는 "어느 요소인가"를 리액트에 알려주는 용도라 컴포넌트에 넘기지 않고 가로챘다. 19에서 ref는 그 특별 취급을 벗었고 key는 그대로다.',
      },
      {
        question: 'ref를 안쪽 어디에 넘길지는 누가 정하는가',
        answer:
          '컴포넌트를 만든 쪽이다. 부모는 "이 컴포넌트에 ref를 줬다"만 알고, 그것이 input에 붙는지 button에 붙는지는 자식이 정한다. 그래서 컴포넌트 안의 구조를 바꿔도 부모 코드는 그대로다.',
      },
    ],
    sources: ['https://react.dev/blog/2024/12/05/react-19#ref-as-a-prop'],
    quiz: {
      question: 'React 19에서 함수 컴포넌트가 ref를 받는 방법은 무엇인가',
      options: [
        'forwardRef로 감싸야만 받는다',
        '다른 prop처럼 매개변수에서 꺼낸다',
        'this.ref로 읽는다',
      ],
      answerIndex: 1,
      explanation:
        '19부터 ref는 props에 그대로 들어온다. forwardRef는 그전 방식이고 남아 있지만 새로 쓸 이유가 없다.',
    },
  },
  {
    id: 'action-state',
    chapter: '5',
    order: 35,
    title: 'Action과 useActionState',
    tagline: '제출 중인지 리액트가 안다',
    kind: 'practice',
    definition:
      'Action은 form에 건네는 비동기 함수다. useActionState는 그 함수를 감싸서, 지난 결과와 지금 제출 중인지를 함께 돌려준다. 제출 중 표시와 실패 처리를 직접 만들 필요가 없다.',
    goal: '추가를 누르면 버튼이 "저장 중…"으로 바뀌고 0.8초 뒤 목록에 들어간다. 느낌표가 들어가면 실패 문구가 나온다.',
    starterCode: `let nextId = 2

// 서버에 저장하는 척. 느낌표가 있으면 실패한다.
function fakeSave(title) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (title.includes('!')) reject(new Error('느낌표는 저장할 수 없다'))
      else resolve()
    }, 800)
  })
}

// 지난 결과와 폼 내용을 받아 다음 결과를 돌려준다. reducer와 닮았다.
async function addTodo(prev, formData) {
  const title = formData.get('title').trim()
  if (title === '') return { ...prev, error: '비어 있다' }
  try {
    await fakeSave(title)
    return { todos: [...prev.todos, { id: nextId++, title }], error: null }
  } catch (err) {
    return { ...prev, error: err.message }
  }
}

function App() {
  const [state, addAction, isPending] = useActionState(addTodo, {
    todos: [{ id: 1, title: '장보기' }],
    error: null,
  })

  return (
    <section>
      <ul>
        {state.todos.map((todo) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
      {/* action에 함수를 주면 리액트가 제출을 가로채 그 함수를 부른다. 페이지가 새로 뜨지 않는다. */}
      <form action={addAction}>
        <input name="title" placeholder="새 할 일" disabled={isPending} />
        <button disabled={isPending}>{isPending ? '저장 중…' : '추가'}</button>
      </form>
      {state.error && <p>{state.error}</p>}
    </section>
  )
}
`,
    before: {
      text: '폼을 낼 때마다 제출 중인지, 실패했는지를 state로 직접 만들어 관리했다. 폼마다 같은 코드를 다시 썼다.',
      code: `function App() {
  const [todos, setTodos] = useState([])
  const [pending, setPending] = useState(false)   // 제출 중인지
  const [error, setError] = useState(null)         // 실패했는지

  async function handleSubmit(e) {
    e.preventDefault()                              // 페이지가 새로 뜨는 것을 막는다
    setPending(true)
    setError(null)
    try {
      await fakeSave(title)
      setTodos([...todos, title])
    } catch (err) {
      setError(err.message)
    } finally {
      setPending(false)                             // 빠뜨리면 버튼이 영영 잠긴다
    }
  }
  // ...
}
`,
    },
    why: [
      'pending을 켜고 끄는 코드, 오류를 지우고 넣는 코드, preventDefault가 폼마다 반복됐다. finally를 빠뜨리면 버튼이 잠긴 채 남았고, 제출 두 번을 빨리 누르면 앞 결과가 뒤 결과를 덮었다.',
      'Action은 그 반복을 리액트가 가져간다. 함수 하나를 form에 주면 제출 중 여부를 리액트가 세고, 결과를 돌려주면 다음 state가 된다. 입력칸도 제출이 끝나면 비워진다.',
    ],
    deeper: [
      {
        question: 'onSubmit과 action은 무엇이 다른가',
        answer:
          'onSubmit은 이벤트를 받는 핸들러라 preventDefault와 상태 관리를 직접 한다. action은 리액트가 제출을 가로채 부르는 함수라 그 일이 없다. 그리고 action은 비동기라는 것을 리액트가 알아서, 끝날 때까지를 "제출 중"으로 센다.',
      },
      {
        question: '입력칸에 value를 안 준 이유',
        answer:
          'formData로 읽으므로 state에 넣을 필요가 없다. 제출이 끝나면 리액트가 폼을 비워 준다. 글자를 치는 동안 무엇을 하려면 그때 state로 바꾼다.',
      },
      {
        question: 'useActionState의 첫 인자는 왜 reducer처럼 생겼는가',
        answer:
          '지난 결과를 받아 다음 결과를 돌려주기 때문이다. 다른 점은 비동기여도 된다는 것과, 두 번째 인자가 action이 아니라 formData라는 것이다.',
      },
    ],
    sources: ['https://react.dev/reference/react/useActionState'],
    quiz: {
      question: '`useActionState`가 돌려주는 세 번째 값 `isPending`은 무엇인가',
      options: [
        '마지막 제출이 실패했는지',
        'action이 아직 끝나지 않았는지',
        '폼이 비어 있는지',
      ],
      answerIndex: 1,
      explanation:
        'action이 시작해서 끝날 때까지 true다. 직접 켜고 끄지 않아도 되므로 잠긴 채 남는 일이 없다.',
    },
  },
  {
    id: 'optimistic',
    chapter: '5',
    order: 36,
    title: 'useOptimistic으로 낙관적 UI',
    tagline: '될 거라고 믿고 먼저 그린다',
    kind: 'practice',
    definition:
      'useOptimistic은 action이 도는 동안만 쓰는 임시 state를 준다. 결과를 기다리지 않고 먼저 화면에 그리고, action이 끝나면 임시 값은 버리고 진짜 값으로 돌아간다. 이렇게 성공을 가정하고 먼저 보여주는 것을 낙관적 UI라 한다.',
    goal: '추가를 누르면 기다리지 않고 바로 목록에 흐리게 뜬다. 0.8초 뒤 진해진다. 느낌표가 들어가면 흐린 항목이 사라진다.',
    starterCode: `let nextId = 2

function fakeSave(title) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (title.includes('!')) reject(new Error('느낌표는 저장할 수 없다'))
      else resolve()
    }, 800)
  })
}

function App() {
  const [todos, setTodos] = useState([{ id: 1, title: '장보기' }])
  const [error, setError] = useState(null)

  // todos에 임시 항목을 얹은 목록. action이 끝나면 todos로 되돌아간다.
  const [shown, addOptimistic] = useOptimistic(todos, (current, title) => [
    ...current,
    { id: 'temp', title, pending: true },
  ])

  async function addAction(formData) {
    const title = formData.get('title').trim()
    if (title === '') return
    setError(null)
    addOptimistic(title)               // 먼저 그린다
    try {
      await fakeSave(title)
      setTodos((prev) => [...prev, { id: nextId++, title }])   // 진짜로 넣는다
    } catch (err) {
      setError(err.message)            // 임시 항목은 저절로 사라진다
    }
  }

  return (
    <section>
      <ul>
        {shown.map((todo) => (
          <li key={todo.id} style={{ opacity: todo.pending ? 0.4 : 1 }}>
            {todo.title}
          </li>
        ))}
      </ul>
      <form action={addAction}>
        <input name="title" placeholder="새 할 일" />
        <button>추가</button>
      </form>
      {error && <p>{error}</p>}
    </section>
  )
}
`,
    before: {
      text: '먼저 보여주고 싶으면 목록에 직접 넣고, 실패하면 손으로 빼야 했다. 되돌리는 처리를 자주 빠뜨렸다.',
      code: `async function add(title) {
  const temp = { id: 'temp', title }
  setTodos([...todos, temp])                   // 먼저 넣고
  try {
    await fakeSave(title)
    setTodos((prev) => prev.map((t) => (t.id === 'temp' ? { ...t, id: realId } : t)))
  } catch {
    setTodos((prev) => prev.filter((t) => t.id !== 'temp'))   // 실패하면 직접 뺀다
  }
}
`,
    },
    why: [
      '임시 항목을 넣는 코드와 빼는 코드가 따로 있어서, 실패 갈래를 빠뜨리면 저장되지 않은 항목이 화면에 남았다. 두 번 빨리 누르면 temp가 둘이 되어 어느 것을 빼야 할지 꼬였다.',
      'useOptimistic은 임시 값을 진짜 state와 분리해 둔다. action이 끝나면 임시 값이 저절로 사라지므로 되돌리는 코드가 없다. 실패했을 때 무엇이 되돌아가는지가 정해져 있다.',
    ],
    deeper: [
      {
        question: '낙관적으로 먼저 보여준 화면은 실패하면 무엇이 되돌아가는가',
        answer:
          'useOptimistic이 얹은 임시 값만 사라지고 진짜 state는 그대로다. 위 코드에서 실패하면 setTodos를 안 불렀으므로 todos는 원래대로이고, shown이 todos로 돌아간다. 화면에서 흐린 항목이 사라지는 것이 그 순간이다.',
      },
      {
        question: 'addOptimistic을 action 밖에서 부르면',
        answer:
          '경고가 나고 뜻대로 되지 않는다. 임시 값은 "action이 도는 동안"에만 뜻이 있다. 언제 버릴지를 action의 끝으로 정하기 때문이다.',
      },
      {
        question: '아무 데나 낙관적으로 그려도 되는가',
        answer:
          '실패가 드물고 되돌려도 어색하지 않은 일에만 쓴다. 결제나 삭제처럼 실패했을 때 사용자가 이미 다음 행동을 했을 수 있는 일은 결과를 기다리는 쪽이 낫다.',
      },
    ],
    sources: ['https://react.dev/reference/react/useOptimistic'],
    quiz: {
      question: 'action이 실패했을 때 useOptimistic으로 얹은 항목은 어떻게 되는가',
      options: [
        '실패 표시가 붙은 채 남는다',
        '저절로 사라지고 진짜 state가 보인다',
        'filter로 직접 빼야 한다',
      ],
      answerIndex: 1,
      explanation:
        '임시 값은 action이 끝나면 버려진다. 성공이든 실패든 같다. 성공했을 때 남는 것은 setTodos로 넣은 진짜 항목이다.',
    },
  },
  {
    id: 'use',
    chapter: '5',
    order: 37,
    title: 'use로 값과 Context 읽기',
    tagline: '기다리는 것도 조건부도 된다',
    kind: 'practice',
    definition:
      'use는 Promise나 Context를 읽는 훅이다. Promise를 주면 끝날 때까지 가장 가까운 Suspense가 대신 그려지고, 끝나면 그 값으로 그린다. 다른 훅과 달리 if 안에서 불러도 된다.',
    goal: '목록이 1초 뒤 "서버"에서 오고, 오는 동안 "불러오는 중…"이 보인다. 테마는 조건에 따라 읽거나 안 읽는다.',
    starterCode: `const ThemeContext = createContext('light')

// 서버에서 목록을 받는 척. Promise는 컴포넌트 밖에서 한 번만 만든다.
const todosPromise = new Promise((resolve) => {
  setTimeout(() => resolve(['장보기', '설거지', '빨래']), 1000)
})

function TodoList() {
  // 끝날 때까지 이 함수는 여기서 멈추고, 위의 Suspense가 대신 그려진다
  const todos = use(todosPromise)
  return (
    <ul>
      {todos.map((title) => (
        <li key={title}>{title}</li>
      ))}
    </ul>
  )
}

function Badge({ show }) {
  // useContext였다면 if 안에서 부를 수 없다. use는 된다.
  if (!show) return null
  const theme = use(ThemeContext)
  return <small>테마: {theme}</small>
}

function App() {
  const [showBadge, setShowBadge] = useState(true)

  return (
    <ThemeContext.Provider value="dark">
      <section>
        <h2>할 일</h2>
        <Suspense fallback={<p>불러오는 중…</p>}>
          <TodoList />
        </Suspense>
        <label>
          <input type="checkbox" checked={showBadge} onChange={(e) => setShowBadge(e.target.checked)} />
          테마 표시
        </label>
        <Badge show={showBadge} />
      </section>
    </ThemeContext.Provider>
  )
}
`,
    deeper: [
      {
        question: 'Promise를 컴포넌트 안에서 만들면 왜 안 되는가',
        answer:
          '렌더마다 새 Promise가 만들어진다. use는 그 Promise가 끝나기를 기다렸다가 다시 그리는데, 다시 그리면 또 새 Promise라서 영영 끝나지 않는다. 밖에서 만들거나, 서버 컴포넌트나 라이브러리가 만들어 넘겨준 것을 쓴다.',
      },
      {
        question: 'Suspense가 없으면',
        answer:
          '더 위의 Suspense를 찾는다. 이 편집기의 결과 패널은 기본으로 Suspense를 감싸 두었지만, 실제 앱에서 하나도 없으면 오류다. 기다리는 동안 무엇을 보여줄지는 반드시 정해야 한다.',
      },
      {
        question: 'use가 if 안에서 되는 이유',
        answer:
          '다른 훅은 호출 순서로 어느 state인지 찾는다(레슨 12). use는 자기 state가 없다. 받은 Promise나 Context를 읽기만 하므로 순서가 밀려도 상관없다.',
      },
    ],
    sources: ['https://react.dev/reference/react/use'],
    quiz: {
      question: '`use(promise)`를 부른 컴포넌트는 Promise가 끝날 때까지 어떻게 되는가',
      options: [
        'undefined로 한 번 그려지고 끝나면 다시 그려진다',
        '가장 가까운 Suspense의 fallback이 대신 그려진다',
        '오류가 난다',
      ],
      answerIndex: 1,
      explanation:
        '기다리는 동안은 그 컴포넌트 대신 Suspense의 fallback이 보인다. 끝나면 값이 들어간 채로 그려진다.',
    },
  },
  {
    id: 'compiler',
    chapter: '5',
    order: 38,
    title: 'React Compiler가 대신 해주는 일',
    tagline: 'memo를 사람이 안 붙인다',
    kind: 'concept',
    definition:
      'React Compiler는 빌드할 때 코드를 읽어 memo·useMemo·useCallback을 붙일 자리를 찾아 대신 붙인다. 코드를 고치지 않아도 레슨 33에서 손으로 한 일이 된다.',
    // 빌드 도구 얘기라 편집기가 아니다. 이 앱의 편집기는 컴파일러를 켜지 않았다.
    readOnly: [
      {
        filename: '내가 쓴 코드',
        code: `function App() {
  const [todos, setTodos] = useState([])
  const [tick, setTick] = useState(0)

  const toggle = (id) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
  }
  const left = todos.filter((t) => !t.done).length

  return <TodoList todos={todos} onToggle={toggle} left={left} />
}
`,
      },
      {
        filename: '컴파일러가 만든 코드 (뜻만 옮김)',
        code: `function App() {
  const [todos, setTodos] = useState([])
  const [tick, setTick] = useState(0)

  // toggle은 아무것도 안 바뀌므로 한 번만 만든다
  const toggle = 기억해둔_값_또는(() => (id) => { ... })

  // left는 todos가 바뀔 때만 다시 센다
  const left = todos가_같으면_지난값_아니면(() => todos.filter((t) => !t.done).length)

  // TodoList도 props가 같으면 건너뛴다
  return 같으면_건너뜀(<TodoList todos={todos} onToggle={toggle} left={left} />)
}
`,
      },
    ],
    before: {
      text: '화면이 느려지면 memo, useMemo, useCallback을 사람이 찾아 붙였다. 어디에 붙여야 할지 판단하기 어렵고, 붙이고도 효과를 확인하기 힘들었다.',
      code: `// 이 셋을 어디에 붙일지 매번 사람이 정했다
const TodoCard = memo(function TodoCard({ todo, onToggle }) { ... })
const toggle = useCallback((id) => { ... }, [])
const left = useMemo(() => todos.filter((t) => !t.done).length, [todos])
`,
    },
    why: [
      '레슨 33의 세 줄은 붙이는 자리가 하나라도 빠지면 효과가 사라진다. useCallback을 빠뜨리면 memo가 소용없어지는 식이다. 그리고 붙일수록 코드가 길어져, 무엇을 하는 컴포넌트인지가 메모이제이션 코드에 가려졌다.',
      '컴파일러는 코드를 읽고 "이 값은 저 값이 바뀔 때만 바뀐다"를 알아내 그 자리에 기억을 붙인다. 사람은 레슨 10의 순수성만 지키면 된다. 컴파일러가 믿는 것이 그 규칙이기 때문이다.',
    ],
    deeper: [
      {
        question: '컴파일러가 있어도 손으로 붙여야 하는 경우',
        answer:
          '컴포넌트가 규칙을 어기면 컴파일러는 그 컴포넌트를 건너뛴다. 렌더 중에 바깥 값을 고치거나 ref를 읽는 코드가 그렇다. 그리고 리액트 밖에서 온 값(라이브러리가 매번 새로 주는 객체)은 컴파일러도 같은지 알 수 없다.',
      },
      {
        question: '이 앱은 컴파일러를 쓰는가',
        answer:
          '아니다. 편집기의 코드도 컴파일러 없이 변환된다. 레슨 33에서 memo를 빼면 렌더 횟수가 오르는 것을 보는 것이 이 앱의 목적이라, 일부러 켜지 않았다.',
      },
      {
        question: '메모이제이션을 아예 안 배워도 되는가',
        answer:
          '컴파일러가 무엇을 하는지 알려면 손으로 한 번은 해 봐야 한다. 그리고 컴파일러가 건너뛴 컴포넌트를 만나면 여전히 손으로 붙인다.',
      },
    ],
    sources: ['https://react.dev/learn/react-compiler'],
    quiz: {
      question: 'React Compiler가 코드를 최적화할 수 있으려면 컴포넌트가 무엇을 지켜야 하는가',
      options: [
        'class로 쓰여 있어야 한다',
        '레슨 10의 순수성 규칙 — 같은 입력이면 같은 출력, 렌더 중 바깥을 고치지 않는다',
        'useMemo를 미리 붙여 두어야 한다',
      ],
      answerIndex: 1,
      explanation:
        '컴파일러는 "이 값은 저 값이 바뀔 때만 바뀐다"를 믿고 기억을 붙인다. 그 믿음의 근거가 순수성이다. 어긴 컴포넌트는 건너뛴다.',
    },
  },
  {
    id: 'server-components',
    chapter: '5',
    order: 39,
    title: '서버 컴포넌트가 푸는 문제',
    tagline: '브라우저로 내려보내지 않는 컴포넌트',
    kind: 'concept',
    definition:
      '서버 컴포넌트는 서버에서만 돌고 결과만 브라우저로 온다. 데이터를 서버에서 바로 읽을 수 있고, 그 컴포넌트의 코드는 브라우저에 내려가지 않는다. state와 Effect는 쓸 수 없다. 그것들은 브라우저에서 도는 클라이언트 컴포넌트의 몫이다.',
    // 브라우저 단독으로 실행할 수 없다. 서버가 있어야 한다.
    readOnly: [
      {
        filename: 'TodoPage.jsx — 서버 컴포넌트',
        code: `// 서버에서만 돈다. async여도 된다.
export default async function TodoPage() {
  const todos = await db.todos.list()   // 브라우저에서는 못 하는 일

  return (
    <section>
      <h2>할 일 {todos.length}개</h2>
      {/* todos는 JSON으로 바꿀 수 있어야 넘어간다 */}
      <TodoList todos={todos} />
    </section>
  )
}
`,
      },
      {
        filename: 'TodoList.jsx — 클라이언트 컴포넌트',
        code: `'use client'   // 이 줄부터 브라우저로 내려간다

export default function TodoList({ todos }) {
  const [filter, setFilter] = useState('all')   // state는 여기서만
  // ...
}
`,
      },
    ],
    before: {
      text: '모든 컴포넌트를 브라우저로 내려보내고, 화면이 뜬 뒤 데이터를 다시 요청했다.',
      code: `function TodoPage() {
  const [todos, setTodos] = useState(null)

  useEffect(() => {
    fetch('/api/todos')                   // 화면이 뜬 다음에야 요청이 나간다
      .then((res) => res.json())
      .then(setTodos)
  }, [])

  if (todos === null) return <p>불러오는 중…</p>
  return <TodoList todos={todos} />
}
`,
    },
    why: [
      '내려받을 코드가 계속 커졌다. 데이터를 다듬는 라이브러리, 날짜 포맷, 마크다운 변환기가 전부 브라우저로 갔다. 그리고 요청이 순서대로였다. 코드를 받고, 그리고, 그다음에야 데이터를 요청하고, 그 안의 컴포넌트가 또 요청했다.',
      '서버 컴포넌트는 데이터 읽는 일을 서버에서 끝내고 결과만 보낸다. 무거운 라이브러리는 서버에 남는다. 요청이 화면 뜨기 전에 끝나므로 기다리는 순서가 줄어든다.',
    ],
    deeper: [
      {
        question: '서버에서 클라이언트로 넘기는 값은 왜 JSON으로 바꿀 수 있어야 하는가',
        answer:
          '서버와 브라우저는 다른 컴퓨터다. 값을 글자로 바꿔 보내야 한다(직렬화). 함수, 클래스 인스턴스, Date는 그대로 못 간다. 그래서 서버 컴포넌트가 클라이언트 컴포넌트에 onClick 같은 함수를 props로 줄 수 없다.',
      },
      {
        question: "'use client'는 무엇을 뜻하는가",
        answer:
          '"여기부터는 브라우저로 내려보내라"는 경계 표시다. 이 파일과 여기서 import하는 것이 전부 브라우저로 간다. 반대 방향 표시는 없다. 표시가 없으면 서버 컴포넌트다.',
      },
      {
        question: '이 앱에서는 왜 실습이 없는가',
        answer:
          '서버가 없기 때문이다. 이 앱은 정적 파일만 있어서 서버 컴포넌트를 돌릴 곳이 없다. Next.js 같은 프레임워크가 서버를 맡아 준다.',
      },
    ],
    sources: ['https://react.dev/reference/rsc/server-components'],
    quiz: {
      question: '서버 컴포넌트 안에서 쓸 수 없는 것은 무엇인가',
      options: ['async/await', 'useState와 useEffect', '다른 컴포넌트를 그리는 것'],
      answerIndex: 1,
      explanation:
        '서버 컴포넌트는 한 번 돌고 결과만 보낸다. 기억하거나 화면 뒤에 무언가 하는 일은 브라우저에서 도는 클라이언트 컴포넌트가 한다.',
    },
  },
]
