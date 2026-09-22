export default [
  {
    id: 'first-component',
    chapter: '1',
    order: 3,
    title: '첫 번째 컴포넌트',
    tagline: '화면 한 조각을 함수로 만든다',
    kind: 'practice',
    jsPrereq: ['함수는 값을 돌려준다', '함수 이름은 이름일 뿐이다. 대문자로 시작해도 JS 문법은 같다'],
    definition: '컴포넌트는 화면 한 조각을 돌려주는 함수다. 이름은 대문자로 시작한다. 소문자로 시작하면 리액트가 HTML 태그로 보고 그리려 한다.',
    goal: '할 일 카드 한 장이 화면에 나온다.',
    starterCode: `function TodoCard() {
  return (
    <li>
      <input type="checkbox" />
      <span>장보기</span>
    </li>
  )
}

function App() {
  return (
    <ul>
      <TodoCard />
    </ul>
  )
}
`,
    before: {
      text: '화면 한 조각을 만들려면 class를 만들었다. 메서드마다 this가 무엇을 가리키는지 챙겨야 했고, 생성자에서 bind를 적어 두는 것이 일이었다.',
      code: `class TodoCard extends React.Component {
  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick() {
    console.log(this.props.title)
  }

  render() {
    return <li onClick={this.handleClick}>장보기</li>
  }
}
`,
    },
    why: [
      '메서드 안에서 this가 무엇인지 매번 챙겨야 했다. 챙기는 줄(bind)을 빠뜨리면 클릭했을 때 터졌고, 오류 메시지는 화면 그리기와 아무 상관이 없는 이야기를 했다.',
      '배워야 할 것이 화면 만들기가 아니라 class 규칙이었다. 함수 컴포넌트는 그 층을 없앴다. 값을 돌려주는 함수 하나면 된다.',
    ],
    deeper: [
      {
        question: 'class 컴포넌트는 금지된 것인가',
        answer:
          '아니다. 지금도 동작하고, 오류 경계는 아직 class로만 만들 수 있다. 다만 새로 쓸 이유가 거의 없다.',
      },
      {
        question: '소문자로 시작하면 무엇이 달라지는가',
        answer:
          '리액트가 그 이름의 HTML 태그로 보고 그리려 한다. 대문자로 시작하라는 것은 관례가 아니라 규칙에 가깝다.',
      },
    ],
    sources: ['https://react.dev/learn/your-first-component'],
    quiz: {
      question: '컴포넌트 이름을 소문자 `todoCard`로 쓰면 어떻게 되는가',
      options: [
        '똑같이 동작한다',
        '리액트가 `todoCard`라는 이름의 HTML 태그로 보고 그리려 한다',
        '문법 오류가 난다',
      ],
      answerIndex: 1,
      explanation:
        '소문자로 시작하면 HTML 태그로 취급한다. 그런 태그가 없으니 화면에 아무것도 안 나온다.',
    },
  },
  {
    id: 'import-export',
    chapter: '1',
    order: 4,
    title: '컴포넌트 import와 export',
    tagline: '파일을 나누고 이름으로 가져온다',
    kind: 'concept',
    definition: '컴포넌트를 파일마다 하나씩 두고, 쓰는 쪽에서 import로 가져온다. export default는 이름 없이 값 하나를 내보내고 가져오는 쪽이 이름을 붙인다. 이름을 붙여 내보내면(named) 가져올 때 중괄호로 그 이름을 적는다.',
    // 이 샌드박스는 import를 지원하지 않는다. 그래서 파일 두 개를 나란히 읽는다.
    readOnly: [
      {
        filename: 'TodoCard.jsx',
        code: `export default function TodoCard() {
  return (
    <li>
      <input type="checkbox" />
      <span>장보기</span>
    </li>
  )
}
`,
      },
      {
        filename: 'App.jsx',
        code: `import TodoCard from './TodoCard.jsx'

export default function App() {
  return (
    <ul>
      <TodoCard />
    </ul>
  )
}
`,
      },
    ],
    deeper: [
      {
        question: 'default와 named export는 언제 나누는가',
        answer:
          '파일이 컴포넌트 하나를 대표하면 default, 여러 개를 내보내면 named를 쓴다. 한 파일에 default는 하나뿐이다.',
      },
    ],
    quiz: {
      question: '`export default`로 내보낸 컴포넌트를 가져올 때 이름은 어떻게 정하는가',
      options: [
        '내보낸 파일에 적힌 이름과 반드시 같아야 한다',
        '가져오는 쪽에서 원하는 이름으로 정할 수 있다',
        '중괄호로 감싸야 한다',
      ],
      answerIndex: 1,
      explanation:
        'default export는 이름 없이 값 하나를 내보낸다. 가져오는 쪽이 이름을 붙인다. 중괄호는 named export를 가져올 때 쓴다.',
    },
  },
  {
    id: 'jsx',
    chapter: '1',
    order: 5,
    title: 'JSX로 마크업 작성하기',
    tagline: '함수 안에 태그를 그대로 적는다',
    kind: 'practice',
    definition:
      'JSX는 JS 안에 태그를 적는 문법이다. 태그는 하나로 감싸고, 모두 닫는다. class는 JS의 예약어라서 className으로 쓴다.',
    goal: '카드를 제목이 붙은 영역 안에 넣는다.',
    starterCode: `function TodoCard() {
  return (
    <li className="todo">
      <input type="checkbox" />
      <span>장보기</span>
    </li>
  )
}

function App() {
  return (
    <section>
      <h2>할 일</h2>
      <ul>
        <TodoCard />
      </ul>
    </section>
  )
}
`,
    before: {
      text: '화면에 그릴 태그를 함수 호출로 하나씩 적었다. 중첩된 화면은 호출 안에 호출이 들어갔다.',
      code: `function TodoCard() {
  return React.createElement(
    'li',
    { className: 'todo' },
    React.createElement('input', { type: 'checkbox' }),
    React.createElement('span', null, '장보기'),
  )
}
`,
    },
    why: [
      '코드만 봐서는 화면이 어떻게 생겼는지 안 보였다. 태그 하나를 옮기려면 괄호 짝을 세어야 했다.',
      'JSX는 같은 호출을 태그 모양으로 적게 해 준다. 브라우저가 JSX를 이해하는 것은 아니어서, 실행 전에 위의 함수 호출로 바뀐다.',
    ],
    deeper: [
      {
        question: 'JSX는 무엇으로 바뀌는가',
        answer:
          'React.createElement 호출로 바뀐다. 이 앱의 편집기도 그 변환을 브라우저에서 하고 있다. 그래서 JSX가 문법을 어기면 실행하기 전에 문법 오류로 잡힌다.',
      },
      {
        question: '왜 태그를 하나로 감싸야 하는가',
        answer:
          '함수는 값 하나만 돌려준다. 나란한 태그 둘은 값 둘이다. 감쌀 태그가 마땅치 않으면 빈 태그 한 쌍으로 묶는다.',
      },
    ],
    sources: ['https://react.dev/learn/writing-markup-with-jsx'],
    quiz: {
      question: 'JSX에서 `class` 대신 `className`을 쓰는 이유는 무엇인가',
      options: [
        '리액트가 CSS를 직접 관리하기 때문이다',
        'JSX는 결국 JS이고, `class`는 JS의 예약어이기 때문이다',
        '`class`도 똑같이 동작하지만 관례로 `className`을 쓴다',
      ],
      answerIndex: 1,
      explanation: 'JSX는 JS 안에 있는 문법이다. JS 예약어와 겹치는 이름은 피해서 붙였다.',
    },
  },
  {
    id: 'curly-braces',
    chapter: '1',
    order: 6,
    title: '중괄호로 JSX 안에서 JavaScript 쓰기',
    tagline: 'JS 값을 화면에 끼워 넣는다',
    kind: 'practice',
    jsPrereq: [
      '표현식은 값이 되는 코드다. `1 + 1`, `todos.length`, `a ? b : c`가 표현식이다',
      '`if`나 `for`는 값이 되지 않는다',
    ],
    definition: '중괄호 안에는 값이 되는 JS 코드를 적을 수 있다. 그 값이 화면에 들어간다.',
    goal: '제목과 개수를 변수에서 가져온다.',
    starterCode: `const title = '장보기'
const total = 3

function TodoCard() {
  return (
    <li>
      <input type="checkbox" />
      <span>{title}</span>
    </li>
  )
}

function App() {
  return (
    <section>
      <h2>할 일 {total}개</h2>
      <ul>
        <TodoCard />
      </ul>
    </section>
  )
}
`,
    deeper: [
      {
        question: '중괄호 안에 `if`를 쓰면 왜 안 되는가',
        answer:
          '중괄호는 값이 들어갈 자리다. `if`는 값이 되지 않는다. 같은 일을 값으로 하려면 삼항 연산자를 쓰거나, 컴포넌트 함수 안에서 미리 계산해 변수에 담는다.',
      },
      {
        question: '중괄호에 객체를 넣으면 어떻게 되는가',
        answer:
          '화면에 그릴 수 없다는 오류가 난다. 다만 style 속성처럼 객체를 넘기는 자리는 다르다. 겉의 중괄호가 JS 자리를 열고, 안의 중괄호가 객체다.',
      },
    ],
    quiz: {
      question: '`<h2>할 일 {total}개</h2>`에서 중괄호가 하는 일은 무엇인가',
      options: [
        '문자열 안에서 변수 이름을 찾아 바꿔 준다',
        '그 자리에 JS 표현식의 값을 넣는다',
        '태그 안에서 JS 블록을 실행한다',
      ],
      answerIndex: 1,
      explanation:
        '중괄호는 값이 들어갈 자리를 연다. 문자열 치환이 아니라 표현식을 계산해 그 결과를 넣는다.',
    },
  },
  {
    id: 'props',
    chapter: '1',
    order: 7,
    title: 'props로 데이터 전달하기',
    tagline: '카드마다 다른 내용을 넣는다',
    kind: 'practice',
    jsPrereq: ['구조 분해로 객체에서 필요한 것만 꺼낸다'],
    definition:
      'props는 부모가 자식에게 건네는 값이다. 자식은 읽기만 한다. 자식이 바꿔도 부모가 다음에 그릴 때 원래 값으로 덮인다.',
    goal: '카드 한 장으로 세 줄을 그린다. 제목과 완료 여부가 밖에서 들어온다.',
    starterCode: `function TodoCard({ title, done }) {
  return (
    <li>
      <input type="checkbox" checked={done} readOnly />
      <span>{title}</span>
    </li>
  )
}

function App() {
  return (
    <section>
      <h2>할 일 3개</h2>
      <ul>
        <TodoCard title="장보기" done={true} />
        <TodoCard title="설거지" done={false} />
        <TodoCard title="빨래" done={false} />
      </ul>
    </section>
  )
}
`,
    deeper: [
      {
        question: '자식이 받은 props를 고치면 어떻게 되는가',
        answer:
          '고치지 않는다는 약속으로 쓴다. 자식이 바꿔도 부모가 가진 값은 그대로이고, 다음 렌더에서 원래 값으로 덮인다. 바꿔야 하는 값이면 state가 있을 자리다.',
      },
      {
        question: '`done={false}`와 `done="false"`는 무엇이 다른가',
        answer:
          '앞은 불리언 false, 뒤는 길이 5의 문자열이다. 문자열 "false"는 참으로 취급되므로 조건이 뒤집힌다.',
      },
    ],
    sources: ['https://react.dev/learn/passing-props-to-a-component'],
    quiz: {
      question: 'props를 자식 쪽에서 바꾸면 무엇이 일어나는가',
      options: [
        '부모가 가진 값도 함께 바뀐다',
        '부모의 값은 그대로이고, 다음 렌더에서 원래 값으로 덮인다',
        '리액트가 오류를 내고 렌더를 멈춘다',
      ],
      answerIndex: 1,
      explanation:
        'props는 부모가 매 렌더에 다시 건네는 값이다. 자식이 손댄 흔적은 다음 렌더에서 사라진다.',
    },
  },
  {
    id: 'conditional',
    chapter: '1',
    order: 8,
    title: '조건부 렌더링',
    tagline: '조건에 따라 다른 것을 그린다',
    kind: 'practice',
    definition:
      '무엇을 그릴지도 값이다. 삼항 연산자(`a ? b : c`)나 `&&`로 조건에 따라 다른 JSX를 값으로 고른다. `&&`는 왼쪽이 0이면 0을 그리므로 왼쪽을 불리언으로 만든다.',
    goal: '끝난 항목에 표시가 붙고, 목록이 비면 다른 문장이 나온다. 제목의 렌더링은 리액트가 화면을 그리는 일을 부르는 말이다.',
    starterCode: `function TodoCard({ title, done }) {
  return (
    <li>
      <input type="checkbox" checked={done} readOnly />
      <span>{title}</span>
      {done && <em> · 끝</em>}
    </li>
  )
}

function App() {
  const total = 3

  return (
    <section>
      <h2>할 일 {total}개</h2>
      {total === 0 ? (
        <p>할 일이 없다</p>
      ) : (
        <ul>
          <TodoCard title="장보기" done={true} />
          <TodoCard title="설거지" done={false} />
          <TodoCard title="빨래" done={false} />
        </ul>
      )}
    </section>
  )
}
`,
    deeper: [
      {
        question: '`{total && <p>남음</p>}`에서 total이 0이면 무엇이 그려지는가',
        answer:
          '숫자 0이 화면에 그대로 찍힌다. `&&`는 왼쪽이 거짓이면 왼쪽 값을 그대로 돌려주고, 리액트는 0을 그릴 수 있는 값으로 본다. `total > 0 &&`처럼 불리언으로 만들어야 한다.',
      },
      {
        question: '아무것도 그리지 않으려면 무엇을 돌려주는가',
        answer: '`null`이다. `false`와 `undefined`도 화면에 아무것도 남기지 않는다.',
      },
    ],
    quiz: {
      question: '`{count && <p>남음</p>}`에서 count가 0일 때 화면에 무엇이 나오는가',
      options: ['아무것도 안 나온다', '숫자 0이 나온다', '`<p>남음</p>`이 나온다'],
      answerIndex: 1,
      explanation:
        '`&&`는 왼쪽이 거짓이면 왼쪽 값을 돌려준다. 그 값이 0이고, 리액트는 0을 그린다. `count > 0 &&`로 불리언을 만들어야 한다.',
    },
  },
  {
    id: 'lists',
    chapter: '1',
    order: 9,
    title: '리스트 렌더링',
    tagline: '배열을 화면으로 바꾼다',
    kind: 'practice',
    jsPrereq: ['map은 원본을 두고 새 배열을 돌려준다'],
    definition:
      '배열을 map으로 돌려 JSX 배열을 만들면 리액트가 순서대로 그린다. 항목마다 key가 필요하다.',
    goal: '할 일이 배열에서 목록으로 늘어난다. 항목을 더하려면 배열만 고친다.',
    starterCode: `const todos = [
  { id: 'a', title: '장보기', done: true },
  { id: 'b', title: '설거지', done: false },
  { id: 'c', title: '빨래', done: false },
]

function TodoCard({ title, done }) {
  return (
    <li>
      <input type="checkbox" checked={done} readOnly />
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
          <TodoCard key={todo.id} title={todo.title} done={todo.done} />
        ))}
      </ul>
    </section>
  )
}
`,
    before: {
      text: '목록에서 몇 번째인지로 항목을 구분했다. 배열의 자리 번호가 곧 항목의 이름표였다.',
      code: `{todos.map((todo, i) => (
  <li key={i}>
    <input defaultValue={todo.title} />
  </li>
))}
`,
    },
    why: [
      '중간에 하나를 넣거나 지우면 자리 번호가 밀린다. 0번이 가리키는 항목이 방금 전과 달라지므로, 입력값과 포커스가 엉뚱한 줄에 남았다.',
      'key는 속도를 위한 힌트가 아니라 "이건 아까 그 항목"이라고 알려주는 이름표다. 항목 자체에 붙어 있는 id를 쓴다.',
    ],
    deeper: [
      {
        question: 'key를 아예 안 주면 어떻게 되는가',
        answer:
          'index를 쓴 것과 같게 동작하고 경고가 뜬다. 경고를 없애려고 index를 넣는 것은 문제를 가린 것이다.',
      },
      {
        question: 'key를 `Math.random()`으로 주면 안 되는 이유',
        answer:
          '매번 다른 이름표가 붙으므로 리액트는 모든 항목을 처음 보는 것으로 취급한다. 전부 지우고 새로 만든다.',
      },
    ],
    demo: 'key',
    sources: ['https://react.dev/learn/rendering-lists'],
    quiz: {
      question: '목록 중간에 항목을 넣었을 때 index를 key로 쓰면 무엇이 깨지는가',
      options: [
        '목록이 화면에 아예 안 나온다',
        '항목의 순서가 뒤집힌다',
        '입력값이나 포커스가 원래 항목을 따라가지 못하고 자리에 남는다',
      ],
      answerIndex: 2,
      explanation:
        'key는 "어느 항목인가"를 알려준다. 자리 번호를 쓰면 자리는 맞지만 항목이 어긋나, 그 자리에 있던 입력 상태가 그대로 남는다.',
    },
  },
  {
    id: 'purity',
    chapter: '1',
    order: 10,
    title: '컴포넌트를 순수하게 유지하기',
    tagline: '같은 입력이면 같은 화면',
    kind: 'practice',
    definition:
      '컴포넌트는 같은 props로 부르면 같은 화면을 돌려줘야 한다. 그리는 동안 바깥 값을 고치지 않는다.',
    goal: '남은 개수를 계산해 보여준다. 계산은 그리는 동안 해도 되지만, 고치는 것은 안 된다.',
    starterCode: `const todos = [
  { id: 'a', title: '장보기', done: true },
  { id: 'b', title: '설거지', done: false },
  { id: 'c', title: '빨래', done: false },
]

function TodoCard({ title, done }) {
  return (
    <li>
      <input type="checkbox" checked={done} readOnly />
      <span>{title}</span>
      {done && <em> · 끝</em>}
    </li>
  )
}

function App() {
  const left = todos.filter((todo) => !todo.done).length

  return (
    <section>
      <h2>할 일 {todos.length}개</h2>
      <p>{left === 0 ? '다 끝났다' : '남은 것 ' + left + '개'}</p>
      <ul>
        {todos.map((todo) => (
          <TodoCard key={todo.id} title={todo.title} done={todo.done} />
        ))}
      </ul>
    </section>
  )
}
`,
    deeper: [
      {
        question: '그리는 동안 바깥 값을 고치면 무엇이 깨지는가',
        answer:
          '아래를 편집기에 넣어 보면 된다. 리액트는 같은 화면을 두 번 그려 볼 수 있고, 그때 숫자가 달라진다. 몇 번 그렸는지에 따라 화면이 바뀌면 그 컴포넌트는 더 이상 믿을 수 없다.\n\nlet seen = 0\nfunction App() {\n  seen = seen + 1\n  return <p>{seen}번째</p>\n}',
      },
      {
        question: '그럼 값은 어디서 고치는가',
        answer:
          '이벤트 핸들러 안이다. 클릭이나 입력에 응답하는 코드는 그리는 중이 아니라 그린 다음에 돈다. 다음 챕터가 그 자리다.',
      },
    ],
    sources: ['https://react.dev/learn/keeping-components-pure'],
    quiz: {
      question: '컴포넌트가 순수하다는 것은 무엇을 뜻하는가',
      options: [
        '외부 라이브러리를 쓰지 않는다',
        '같은 props로 부르면 같은 화면을 돌려주고, 그리는 동안 바깥 값을 고치지 않는다',
        'state를 쓰지 않는다',
      ],
      answerIndex: 1,
      explanation:
        '같은 입력이면 같은 출력이고, 그리는 동안 바깥의 무엇도 바꾸지 않는다는 뜻이다. state를 쓰는 것과는 상관없다.',
    },
  },
]
