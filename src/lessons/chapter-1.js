export default [
  {
    id: 'first-component',
    chapter: '1',
    order: 3,
    title: '첫 번째 컴포넌트',
    tagline: '화면 한 조각을 함수로 만든다',
    kind: 'practice',
    jsPrereq: ['함수가 값을 돌려준다는 것', '대문자로 시작하는 이름은 관례일 뿐 문법이 아니다'],
    definition: '컴포넌트는 화면 한 조각을 돌려주는 함수다. 이름은 대문자로 시작한다.',
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
    quiz: {
      question: '컴포넌트 이름을 소문자 `todoCard`로 쓰면 어떻게 되는가',
      options: [
        '똑같이 동작한다',
        '리액트가 `todoCard`라는 이름의 HTML 태그로 보고 그리려 한다',
        '문법 오류가 난다',
      ],
      answerIndex: 1,
      explanation: '소문자로 시작하면 HTML 태그로 취급한다. 그래서 대문자가 관례가 아니라 규칙에 가깝다.',
    },
  },
  {
    id: 'import-export',
    chapter: '1',
    order: 4,
    title: '컴포넌트 import와 export',
    tagline: '파일을 나누고 이름으로 가져온다',
    kind: 'concept',
    definition:
      '컴포넌트를 파일마다 하나씩 두고, 쓰는 쪽에서 import로 가져온다.',
    // 개념 레슨: 편집기 대신 읽기 전용 코드. 이 샌드박스는 import를 지원하지 않으므로 파일 두 개를 나란히 본다.
    readOnly: [
      {
        filename: 'TodoCard.jsx',
        code: `export default function TodoCard({ title }) {
  return <li>{title}</li>
}
`,
      },
      {
        filename: 'App.jsx',
        code: `import TodoCard from './TodoCard.jsx'

export default function App() {
  return (
    <ul>
      <TodoCard title="장보기" />
    </ul>
  )
}
`,
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
    id: 'lists',
    chapter: '1',
    order: 9,
    title: '리스트 렌더링',
    tagline: '배열을 화면으로 바꾼다',
    kind: 'practice',
    jsPrereq: ['map은 원본을 두고 새 배열을 돌려준다'],
    definition: '배열을 map으로 돌려 JSX 배열을 만들면 리액트가 순서대로 그린다.',
    goal: '할 일이 배열에서 목록으로 늘어난다.',
    starterCode: `function App() {
  const todos = [
    { id: 'a', title: '장보기' },
    { id: 'b', title: '설거지' },
    { id: 'c', title: '빨래' },
  ]

  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
  )
}
`,
    before: {
      text: '목록에서 몇 번째인지(index)로 항목을 구분했다. 배열의 자리 번호가 곧 항목의 이름표였다.',
      code: `{todos.map((todo, i) => (
  <li key={i}>
    <input defaultValue={todo.title} />
  </li>
))}
`,
    },
    why: [
      '중간에 하나를 넣거나 지우면 자리 번호가 밀린다. 0번이 가리키는 항목이 어제와 달라지므로, 입력값과 포커스가 엉뚱한 줄에 남았다.',
      'key는 속도를 위한 힌트가 아니라 "이건 아까 그 항목"이라고 알려주는 이름표다. 항목 자체에 붙어 있는 id를 쓴다.',
    ],
    deeper: [
      {
        question: 'key를 아예 안 주면 어떻게 되는가',
        answer:
          '리액트가 index를 쓴 것과 같게 동작하고 경고를 낸다. 경고를 없애려고 index를 넣는 것은 문제를 가린 것이다.',
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
]
