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
        '화면의 해당 요소를 찾아 textContent에 새 숫자를 직접 넣는다',
        '기억해 둔 값을 바꾸고, 화면을 고치는 일은 리액트에 맡긴다',
        '변수를 바꾼 뒤, 화면이 따라오도록 새로고침 함수를 부른다',
      ],
      answerIndex: 1,
      explanation: '데이터 한 군데만 고친다. 화면을 맞추는 일이 리액트가 가져간 몫이다.',
    },
  },
  {
    id: 'js-checklist',
    chapter: '0',
    order: 2,
    title: 'JS 문법 점검: 리액트로 들어가는 관문',
    tagline: '막히면 JS 기초로 돌아간다',
    kind: 'checklist',
    definition:
      '앞으로 나올 레슨이 기대는 JS 문법을 하나씩 확인하는 관문이다. 코드마다 주석의 결과가 왜 나오는지 설명할 수 있으면 지나간다. 막히는 항목은 옆에 달린 JS 레슨으로 돌아간다. 특히 뒤의 두 항목(참조, 클로저)은 리액트에서 가장 많이 막히는 자리의 뿌리다.',
    items: [
      {
        title: 'map은 새 배열을 돌려준다',
        text: '원본은 그대로 있다. 목록을 화면으로 바꿀 때 이걸 쓴다.',
        js: 'js-map',
        code: `const todos = ['장보기', '설거지']
const marked = todos.map((t) => t + '!')
// todos는 그대로, marked는 새 배열`,
      },
      {
        title: '구조 분해로 필요한 것만 꺼낸다',
        text: '객체는 키 이름으로, 배열은 순서로 꺼낸다. props와 useState에서 계속 나온다.',
        js: 'js-destructuring',
        code: `const todo = { title: '장보기', done: false }
const { title, done } = todo
const [first, second] = ['장보기', '설거지']`,
      },
      {
        title: '스프레드는 얕은 복사다',
        text: '새 배열·새 객체를 만든다. 한 겹만 복사하므로 안쪽 객체는 원본과 같은 것을 가리킨다.',
        js: 'js-spread',
        code: `const next = [...todos, '빨래']
const patched = { ...todo, done: true }`,
      },
      {
        title: '&&는 왼쪽이 거짓이면 왼쪽 값을 그대로 돌려준다',
        text: 'true나 false로 바꿔 주지 않는다. 레슨 8에서 이 성질이 화면에 그대로 드러난다.',
        js: 'js-ternary-and',
        code: `0 && '보임'   // 0
'' && '보임'  // ''
3 && '보임'   // '보임'`,
      },
      {
        title: '함수는 값이다',
        text: '괄호를 붙이면 부르고, 붙이지 않으면 함수 자체를 넘긴다. onClick에는 함수 자체를 넘긴다.',
        js: 'js-arrow-functions',
        code: `const label = (todo) => todo.title
console.log(label)                    // 함수 자체
console.log(label({ title: '장보기' })) // 장보기`,
      },
      {
        title: '배열·객체는 참조로 견준다',
        text: '같은 배열을 고치면 고치기 전과 여전히 같은 배열이다. 리액트는 그러면 바뀐 줄 모른다.',
        js: 'js-reference',
        code: `const a = ['장보기']
const b = a
b.push('설거지')
console.log(a.length)                     // 2
console.log(a === b)                      // true
console.log(a === ['장보기', '설거지'])     // false`,
      },
      {
        title: '함수는 만들어질 때의 값을 기억한다',
        text: '나중에 불러도 만들어질 때 보이던 값을 본다. state가 바로 안 바뀌어 보이는 까닭이다.',
        js: 'js-closure',
        code: `function render(count) {
  return () => console.log(count)
}
const first = render(0)
render(1)
first() // 0`,
      },
    ],
    sources: [
      'https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/map',
      'https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment',
      'https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/Spread_syntax',
      'https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/Logical_AND',
      'https://developer.mozilla.org/ko/docs/Web/JavaScript/Guide/Closures',
    ],
    // 관문의 문제는 참조를 묻는다. 여기서 틀리면 리액트 챕터 1로 가기 전에 JS 18로 돌아간다.
    quiz: {
      question: 'const b = a 다음에 b.push(3)을 하면 a는 어떻게 되는가',
      options: [
        'a는 그대로다. b는 a의 복사본이다',
        'a에도 3이 들어 있다. a와 b는 같은 배열이다',
        '오류가 난다. const로 만든 배열에는 push할 수 없다',
      ],
      answerIndex: 1,
      explanation:
        'const b = a는 복사가 아니라 같은 배열에 이름을 하나 더 붙인다. 헷갈렸다면 챕터 1로 가기 전에 JS 18을 다시 본다.',
    },
  },
]
