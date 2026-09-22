export default [
  {
    id: 'react-does',
    chapter: '0',
    order: 1,
    title: '리액트가 대신해 주는 일',
    tagline: '데이터를 바꾸면 화면이 따라온다',
    kind: 'practice',
    definition:
      '리액트는 데이터를 화면으로 바꾸는 함수를 쓰게 하고, 데이터가 바뀔 때 화면을 맞춰 고치는 일을 가져간다.',
    goal: '버튼을 눌러 숫자를 바꾸면 화면이 저절로 따라온다. useState는 지금은 "값을 기억하는 칸"이라고만 알아 두면 된다. 레슨 12에서 제대로 본다.',
    starterCode: `function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>할 일 {count}개</p>
      <button onClick={() => setCount(count + 1)}>추가</button>
    </div>
  )
}
`,
    before: {
      text: '버튼을 누르면 화면에서 바꿀 요소를 직접 찾아 내용을 넣었다. 숫자를 담아 둔 변수와 화면에 적힌 숫자를 두 곳에서 따로 관리했다.',
      code: `let count = 0
const label = document.querySelector('#label')

document.querySelector('#add').addEventListener('click', () => {
  count = count + 1
  label.textContent = '할 일 ' + count + '개'
})
`,
    },
    why: [
      '화면이 커질수록 어디서 무엇을 바꿨는지 추적이 안 됐다. 같은 숫자를 세 곳에 적어 두면 세 곳을 모두 고쳐야 했고, 한 곳을 빠뜨리면 데이터와 화면이 어긋났다.',
      '리액트에서는 화면을 데이터로부터 다시 그린다. 고칠 곳은 데이터 한 군데뿐이고, 화면을 맞추는 일은 리액트가 한다.',
    ],
    deeper: [
      {
        question: 'DOM을 직접 만지지 않게 해 준 대가로 리액트가 가져간 것은 무엇인가',
        answer:
          '언제 다시 그릴지를 리액트가 정한다. 그래서 "내가 방금 바꿨는데 왜 화면이 그대로인가" 같은 질문이 생기고, 그 답이 앞으로의 레슨이다.',
      },
    ],
    sources: ['https://react.dev/learn'],
    quiz: {
      question: '리액트에서 화면에 적힌 숫자를 바꾸려면 무엇을 고치는가',
      options: [
        '화면의 해당 요소를 찾아 textContent를 넣는다',
        '기억해 둔 값을 바꾸고, 화면을 고치는 일은 리액트에 맡긴다',
        '화면과 변수를 각각 한 번씩 고친다',
      ],
      answerIndex: 1,
      explanation: '데이터 한 군데만 고친다. 화면을 맞추는 일이 리액트가 가져간 몫이다.',
    },
  },
  {
    id: 'js-checklist',
    chapter: '0',
    order: 2,
    title: '이 앱에서 쓰는 JS 문법 점검',
    tagline: 'map, 구조 분해, 스프레드를 한 번씩',
    kind: 'checklist',
    definition: '앞으로 나올 레슨이 기대는 JS 문법 세 가지를 짧게 확인한다.',
    items: [
      {
        title: 'map은 새 배열을 돌려준다',
        text: '원본은 그대로 있다. 목록을 화면으로 바꿀 때 이걸 쓴다.',
        code: `const todos = ['장보기', '설거지']
const upper = todos.map((t) => t + '!')
// todos는 그대로, upper는 새 배열`,
      },
      {
        title: '구조 분해로 필요한 것만 꺼낸다',
        text: 'props를 받을 때 계속 나온다.',
        code: `const todo = { title: '장보기', done: false }
const { title, done } = todo`,
      },
      {
        title: '스프레드는 얕은 복사다',
        text: '한 겹만 복사한다. 안쪽 객체는 원본과 같은 것을 가리킨다.',
        code: `const next = [...todos, '빨래']
const patched = { ...todo, done: true }`,
      },
      {
        title: '&&는 왼쪽이 거짓이면 왼쪽 값을 그대로 돌려준다',
        text: 'true나 false로 바꿔 주지 않는다. 레슨 8에서 이 성질이 화면에 그대로 드러난다.',
        code: `0 && '보임'   // 0
'' && '보임'  // ''
3 && '보임'   // '보임'`,
      },
    ],
    quiz: {
      question: '`[...todos, "빨래"]`의 결과는 무엇인가',
      options: [
        'todos에 "빨래"가 추가되고 todos가 바뀐다',
        'todos는 그대로이고, 항목이 하나 더 있는 새 배열이 나온다',
        'todos의 마지막 항목이 "빨래"로 바뀐다',
      ],
      answerIndex: 1,
      explanation: '새 배열이 나온다. 원본을 그대로 두는 것이 리액트에서 중요해진다.',
    },
  },
]
