export default [
  {
    id: 'events',
    chapter: '2',
    order: 11,
    title: '이벤트에 응답하기',
    tagline: '클릭에 함수를 건넨다',
    kind: 'practice',
    jsPrereq: ['함수는 값이다. 변수에 담고, 인자로 넘길 수 있다'],
    definition:
      'onClick 같은 prop에 함수를 건네면 리액트가 그 일이 생겼을 때 불러 준다. 호출한 결과가 아니라 함수 자체를 건넨다.',
    goal: '체크박스와 버튼이 눌린다. 다만 화면은 아직 안 바뀐다.',
    starterCode: `const todos = [
  { id: 'a', title: '장보기', done: true },
  { id: 'b', title: '설거지', done: false },
  { id: 'c', title: '빨래', done: false },
]

function TodoCard({ title, done, onToggle }) {
  return (
    <li>
      <input type="checkbox" checked={done} onChange={onToggle} />
      <span>{title}</span>
    </li>
  )
}

function App() {
  function handleAdd() {
    alert('추가는 아직 안 된다')
  }

  return (
    <section>
      <h2>할 일 {todos.length}개</h2>
      <ul>
        {todos.map((todo) => (
          <TodoCard
            key={todo.id}
            title={todo.title}
            done={todo.done}
            onToggle={() => console.log('토글', todo.title)}
          />
        ))}
      </ul>
      <button onClick={handleAdd}>추가</button>
    </section>
  )
}
`,
    deeper: [
      {
        question: '체크박스를 눌러도 왜 안 바뀌는가',
        answer:
          '핸들러는 불렸다. 콘솔에 찍히는 것으로 확인할 수 있다. 바뀌지 않는 이유는 화면이 todos 배열을 보고 그려지고, 그 배열이 그대로이기 때문이다. 다음 레슨이 이 문제를 푼다.',
      },
      {
        question: 'onToggle이라는 이름은 리액트가 아는 이름인가',
        answer:
          '아니다. 그냥 prop 이름이다. 리액트가 아는 것은 소문자 태그에 붙는 onClick, onChange 같은 것들이고, 내 컴포넌트에 붙이는 이름은 내가 정한다.',
      },
    ],
    sources: ['https://react.dev/learn/responding-to-events'],
    quiz: {
      question: '`onClick={handleAdd()}`는 `onClick={handleAdd}`와 무엇이 다른가',
      options: [
        '똑같이 동작한다',
        '그릴 때 바로 호출되고, 그 반환값이 onClick에 들어간다',
        '클릭할 때마다 두 번 호출된다',
      ],
      answerIndex: 1,
      explanation:
        '괄호를 붙이면 그 자리에서 호출한다. 리액트에 넘어가는 것은 함수가 아니라 호출 결과다.',
    },
  },
  {
    id: 'state',
    chapter: '2',
    order: 12,
    title: 'state: 컴포넌트의 기억',
    tagline: '컴포넌트가 값을 기억한다',
    kind: 'practice',
    jsPrereq: ['배열 구조 분해로 두 값을 한 줄에 받는다'],
    definition:
      'useState는 값 하나와 그 값을 바꾸는 함수를 돌려준다. 바꾸는 함수를 부르면 리액트가 그 컴포넌트를 다시 그린다.',
    goal: '체크박스가 눌린다. 카드마다 자기 상태를 기억한다.',
    starterCode: `const todos = [
  { id: 'a', title: '장보기' },
  { id: 'b', title: '설거지' },
  { id: 'c', title: '빨래' },
]

function TodoCard({ title }) {
  const [done, setDone] = useState(false)

  return (
    <li>
      <input type="checkbox" checked={done} onChange={() => setDone(!done)} />
      <span>{title}</span>
      {done && <em> · 끝</em>}
    </li>
  )
}

function App() {
  return (
    <section>
      <h2>할 일 {todos.length}개</h2>
      <ul>
        {todos.map((todo) => (
          <TodoCard key={todo.id} title={todo.title} />
        ))}
      </ul>
    </section>
  )
}
`,
    before: {
      text: '컴포넌트가 값을 기억하려면 class를 만들고, 생성자에서 this.state에 초기값을 넣고, 바꿀 때는 this.setState를 불렀다. 값을 읽는 곳마다 this가 붙었다.',
      code: `class TodoCard extends React.Component {
  constructor(props) {
    super(props)
    this.state = { done: false }
    this.toggle = this.toggle.bind(this)
  }

  toggle() {
    this.setState({ done: !this.state.done })
  }

  render() {
    return (
      <li>
        <input type="checkbox" checked={this.state.done} onChange={this.toggle} />
        <span>{this.props.title}</span>
      </li>
    )
  }
}
`,
    },
    why: [
      '기억할 값이 하나뿐인데도 class와 생성자와 bind가 따라왔다. 그리고 기억하는 능력은 class 컴포넌트만 가질 수 있어서, 함수로 쓴 컴포넌트에 state가 필요해지면 전부 class로 바꿔 써야 했다.',
      '훅은 그 능력을 함수 안으로 가져왔다. useState 한 줄이면 함수 컴포넌트가 값을 기억한다. 옮겨 쓸 일도 없어졌다.',
    ],
    deeper: [
      {
        question: '훅을 `if` 안에서 쓰면 안 되는 이유는 무엇인가',
        answer:
          '리액트는 훅에 이름을 붙여 두지 않는다. 호출 순서로 어느 state인지 알아낸다. 첫 번째로 부른 useState가 첫 번째 값, 두 번째가 두 번째 값이다. 조건에 따라 건너뛰면 순서가 밀려서, 다음 렌더에 다른 값이 들어온다.',
      },
      {
        question: '같은 컴포넌트를 세 번 그렸는데 state가 섞이지 않는 이유',
        answer:
          'state는 컴포넌트 함수에 붙어 있는 것이 아니라, 화면의 그 자리에 붙어 있다. 세 자리가 각각 자기 값을 들고 있다. 그래서 카드 하나를 눌러도 나머지는 그대로다.',
      },
    ],
    sources: ['https://react.dev/learn/state-a-components-memory'],
    quiz: {
      question: '리액트가 어느 state가 어느 것인지 알아내는 방법은 무엇인가',
      options: [
        '변수 이름으로 안다',
        '훅을 부른 순서로 안다',
        '컴포넌트 이름과 props를 조합해 안다',
      ],
      answerIndex: 1,
      explanation:
        '호출 순서로 안다. 그래서 조건문이나 반복문 안에서 훅을 부르면 순서가 밀려 값이 어긋난다.',
    },
  },
  {
    id: 'render-commit',
    chapter: '2',
    order: 13,
    title: '렌더링과 커밋',
    tagline: '화면이 바뀌기까지 세 단계',
    kind: 'concept',
    definition:
      '화면이 바뀌는 일은 세 단계다. 무언가 렌더를 요청하고(트리거), 리액트가 컴포넌트를 불러 결과를 받고(렌더), 달라진 부분만 실제 화면에 반영한다(커밋).',
    // 내부 동작이라 편집기보다 눈으로 보는 쪽이 낫다. 아래 데모로 이어진다.
    readOnly: [
      {
        filename: '1. 트리거 — 처음 한 번, 그리고 state가 바뀔 때마다',
        code: `const root = createRoot(document.getElementById('root'))
root.render(<App />)   // 처음 한 번

setDone(true)          // 이후에는 state가 바뀔 때마다
`,
      },
      {
        filename: '2. 렌더 — 리액트가 컴포넌트 함수를 부른다',
        code: `// 리액트가 이렇게 부른다고 생각하면 된다
const result = App()
// 결과 안에 <TodoCard />가 있으면 그것도 부른다. 끝까지 내려간다.
`,
      },
      {
        filename: '3. 커밋 — 달라진 부분만 실제 화면에 반영한다',
        code: `// 렌더 결과를 지난번과 비교해서, 바뀐 것만 건드린다.
// 텍스트만 바뀌었으면 텍스트만 고친다. 입력창은 다시 만들지 않는다.
// 그래서 입력 중이던 글자와 포커스가 살아 있다.
`,
      },
    ],
    demo: 'rerender',
    deeper: [
      {
        question: '부모가 다시 그려지면 자식도 항상 다시 그려지는가',
        answer:
          '렌더 단계에서는 그렇다. 자식 함수가 다시 불린다. 하지만 커밋 단계에서 결과가 지난번과 같으면 화면은 건드리지 않는다. 위 데모에서 memo를 켜면 렌더 자체를 건너뛴다.',
      },
      {
        question: '렌더는 화면에 그리는 것이 아닌가',
        answer:
          '아니다. 렌더는 "무엇을 그릴지 계산하는 것"이고, 화면에 실제로 반영하는 것은 커밋이다. 렌더만 하고 커밋하지 않을 수도 있다.',
      },
    ],
    sources: ['https://react.dev/learn/render-and-commit'],
    quiz: {
      question: '리액트에서 "렌더"는 무엇을 뜻하는가',
      options: [
        '화면에 픽셀을 그리는 것',
        '컴포넌트 함수를 불러 무엇을 그릴지 계산하는 것',
        'DOM 요소를 새로 만드는 것',
      ],
      answerIndex: 1,
      explanation:
        '렌더는 계산이다. 계산 결과를 실제 화면에 반영하는 단계는 따로 있고, 그것을 커밋이라 부른다.',
    },
  },
  {
    id: 'snapshot',
    chapter: '2',
    order: 14,
    title: '스냅샷으로서의 state',
    tagline: '이번 렌더의 값은 끝까지 그 값이다',
    kind: 'practice',
    definition:
      'state를 바꿔도 지금 돌고 있는 코드의 변수는 바뀌지 않는다. 그 변수는 이번 렌더에 찍힌 사진이고, 새 값은 다음 렌더에 들어온다.',
    goal: '왜 방금 바꾼 값이 바로 안 읽히는지 눈으로 확인한다.',
    starterCode: `function App() {
  const [count, setCount] = useState(0)

  function handleClick() {
    setCount(count + 1)
    // 위에서 바꿨는데도 여기서 읽은 count는 아직 예전 값이다
    alert('방금 읽은 count는 ' + count)
  }

  return (
    <section>
      <h2>추가한 횟수 {count}</h2>
      <button onClick={handleClick}>추가</button>
    </section>
  )
}
`,
    deeper: [
      {
        question: '왜 변수를 바로 바꾸지 않는가',
        answer:
          '한 번의 클릭 처리가 도는 동안 값이 중간에 변하면, 같은 핸들러 안에서 앞뒤로 읽은 값이 달라진다. 이번 렌더의 값이 고정되어 있으면 그런 일이 없다.',
      },
      {
        question: '바뀐 값을 핸들러 안에서 읽어야 하면 어떻게 하는가',
        answer:
          '계산해서 변수에 담아 쓴다. `const next = count + 1`을 만들고 `setCount(next)`와 함께 쓰면 된다.',
      },
    ],
    sources: ['https://react.dev/learn/state-as-a-snapshot'],
    quiz: {
      question: '`setCount(count + 1)` 바로 다음 줄에서 `count`를 읽으면 무엇이 나오는가',
      options: ['새 값', '예전 값', '경우에 따라 다르다'],
      answerIndex: 1,
      explanation:
        '예전 값이다. 이번 렌더의 count는 고정되어 있다. 새 값은 다음 렌더에서 들어온다.',
    },
  },
  {
    id: 'update-queue',
    chapter: '2',
    order: 15,
    title: 'state 업데이트 큐',
    tagline: '세 번 불러도 한 번만 오르는 이유',
    kind: 'practice',
    definition:
      '리액트는 이벤트 하나가 끝날 때까지 바꿀 값을 모아 두었다가 한 번에 처리한다. 값 대신 함수를 넘기면 앞의 결과를 받아 이어서 계산한다.',
    goal: '두 버튼의 차이를 직접 눌러 확인한다.',
    starterCode: `function App() {
  const [count, setCount] = useState(0)

  function addThreeWrong() {
    setCount(count + 1)
    setCount(count + 1)
    setCount(count + 1)
  }

  function addThreeRight() {
    setCount((n) => n + 1)
    setCount((n) => n + 1)
    setCount((n) => n + 1)
  }

  return (
    <section>
      <h2>{count}</h2>
      <button onClick={addThreeWrong}>+3 (값을 넘기면)</button>
      <button onClick={addThreeRight}>+3 (함수를 넘기면)</button>
      <button onClick={() => setCount(0)}>0으로</button>
    </section>
  )
}
`,
    deeper: [
      {
        question: '값을 넘긴 쪽은 왜 1만 오르는가',
        answer:
          '세 줄 모두 이번 렌더의 count를 읽는다. count가 0이면 세 번 다 "1로 만들어라"라고 말한 것이다. 마지막 말이 이겨서 1이 된다.',
      },
      {
        question: '그럼 항상 함수를 넘기면 되는가',
        answer:
          '앞의 값에서 이어 계산할 때만 필요하다. 이전 값과 상관없이 정하는 값이면 값을 그대로 넘기는 쪽이 읽기 쉽다.',
      },
    ],
    sources: ['https://react.dev/learn/queueing-a-series-of-state-updates'],
    quiz: {
      question: 'count가 0일 때 `setCount(count + 1)`을 세 번 부르면 count는 얼마가 되는가',
      options: ['3', '1', '0'],
      answerIndex: 1,
      explanation:
        '세 줄 모두 이번 렌더의 0을 읽어 "1로 만들어라"라고 말한다. 결과는 1이다. 3을 원하면 함수를 넘겨야 한다.',
    },
  },
  {
    id: 'object-state',
    chapter: '2',
    order: 16,
    title: '객체 state 업데이트하기',
    tagline: '고치지 않고 새로 만들어 넘긴다',
    kind: 'practice',
    jsPrereq: ['스프레드는 얕은 복사다. 한 겹만 복사한다'],
    definition:
      '객체 state는 직접 고치지 않는다. 스프레드로 복사해 바꿀 칸만 덮은 새 객체를 만들어 넘긴다.',
    goal: '새 할 일을 적을 입력 폼이 생긴다. 제목과 급함 여부를 한 객체에 담는다.',
    starterCode: `function App() {
  const [draft, setDraft] = useState({ title: '', urgent: false })

  return (
    <section>
      <input
        value={draft.title}
        placeholder="새 할 일"
        onChange={(e) => setDraft({ ...draft, title: e.target.value })}
      />
      <label>
        <input
          type="checkbox"
          checked={draft.urgent}
          onChange={(e) => setDraft({ ...draft, urgent: e.target.checked })}
        />
        급함
      </label>
      <p>
        {draft.title === '' ? '(비어 있음)' : draft.title}
        {draft.urgent && ' · 급함'}
      </p>
    </section>
  )
}
`,
    deeper: [
      {
        question: '`draft.title = "장보기"`처럼 고치면 어떻게 되는가',
        answer:
          '값은 바뀌지만 화면은 그대로다. 리액트에게 바뀌었다고 말한 적이 없기 때문이다. setDraft를 부르지 않았으니 다시 그리지도 않는다.',
      },
      {
        question: '중첩된 객체는 어떻게 고치는가',
        answer:
          '바꿔야 하는 층마다 복사해야 한다. 스프레드는 한 겹만 복사하므로, 안쪽 객체는 원본과 같은 것을 가리킨다. 깊어지면 state 구조를 다시 보는 쪽이 낫다. 챕터 3이 그 이야기다.',
      },
    ],
    sources: ['https://react.dev/learn/updating-objects-in-state'],
    quiz: {
      question: '`{ ...draft, title: "장보기" }`가 하는 일은 무엇인가',
      options: [
        'draft의 title 칸을 "장보기"로 고친다',
        'draft를 한 겹 복사한 새 객체를 만들고, 그 복사본의 title만 "장보기"로 둔다',
        'draft와 title을 합친 배열을 만든다',
      ],
      answerIndex: 1,
      explanation:
        '새 객체가 나온다. 원본 draft는 그대로다. 리액트는 객체가 바뀌었는지를 이 "다른 객체인가"로 판단한다.',
    },
  },
  {
    id: 'array-state',
    chapter: '2',
    order: 17,
    title: '배열 state 업데이트하기',
    tagline: '추가도 토글도 새 배열로',
    kind: 'practice',
    jsPrereq: [
      'push, splice는 원본을 고친다',
      'map, filter, 스프레드는 새 배열을 돌려준다',
    ],
    definition:
      '배열 state도 직접 고치지 않는다. 추가는 스프레드로, 수정은 map으로, 삭제는 filter로 새 배열을 만들어 넘긴다.',
    goal: '할 일이 추가되고 체크박스가 눌린다. 챕터 2에서 만들려던 앱이 여기서 완성된다.',
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

  function toggle(id) {
    // 바꿀 항목만 새 객체로 갈고, 나머지는 그대로 둔 새 배열
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, done: !todo.done } : todo)))
  }

  function add() {
    if (draft.trim() === '') return
    setTodos([...todos, { id: 'n' + nextId++, title: draft, done: false }])
    setDraft('')
  }

  const left = todos.filter((todo) => !todo.done).length

  return (
    <section>
      <h2>할 일 {todos.length}개</h2>
      <p>{left === 0 ? '다 끝났다' : '남은 것 ' + left + '개'}</p>
      <ul>
        {todos.map((todo) => (
          <TodoCard key={todo.id} todo={todo} onToggle={toggle} />
        ))}
      </ul>
      <input
        value={draft}
        placeholder="새 할 일"
        onChange={(e) => setDraft(e.target.value)}
      />
      <button onClick={add}>추가</button>
    </section>
  )
}
`,
    before: {
      text: '가지고 있던 배열을 그대로 고쳤다. 추가는 push, 삭제는 splice였다.',
      code: `function add(title) {
  todos.push({ id: 'n1', title: title, done: false })
  setTodos(todos)
}
`,
    },
    why: [
      '리액트는 바뀌었는지를 "지난번과 다른 배열인가"로 판단한다. 같은 배열을 고쳐서 넘기면 지난번과 같은 배열이므로, 안의 내용이 달라져도 다시 그리지 않았다. 항목을 추가했는데 화면이 그대로인 일이 여기서 나왔다.',
      '새 배열을 만들어 넘기면 다른 배열이므로 리액트가 알아챈다. 원본을 두고 새것을 만드는 습관이 화면과 데이터를 어긋나지 않게 한다.',
    ],
    deeper: [
      {
        question: '비교를 깊게 하면 이 규칙이 필요 없지 않은가',
        answer:
          '항목이 많은 배열을 매번 속까지 비교하면 그 비교가 오히려 비싸진다. 리액트는 얕게만 비교한다. 참조가 같으면 같은 것으로 본다.',
      },
      {
        question: 'toggle에서 `{ ...todo, done: !todo.done }`을 만드는 이유',
        answer:
          '배열만 새로 만들고 항목 객체를 그대로 고치면, 그 항목을 보고 있는 자식은 같은 객체를 받는다. memo로 감싼 자식이라면 건너뛴다. 바꾼 층까지 새로 만들어야 한다.',
      },
    ],
    sources: ['https://react.dev/learn/updating-arrays-in-state'],
    quiz: {
      question: '`todos.push(newTodo)` 다음에 `setTodos(todos)`를 부르면 어떻게 되는가',
      options: [
        '항목이 추가되고 화면도 바뀐다',
        '배열에는 추가되지만 화면은 그대로다',
        '리액트가 오류를 낸다',
      ],
      answerIndex: 1,
      explanation:
        '넘긴 배열이 지난번과 같은 배열이다. 리액트는 얕게 비교하므로 바뀐 것이 없다고 보고 다시 그리지 않는다.',
    },
  },
]
