// JS 기초 챕터 D. 리액트가 기대는 깊은 곳. 같은 것인가, 함수는 무엇을 기억하나, 나중에 오는 값은 어떻게 기다리나.
// 21~23은 콘솔의 '나중' 표시로 실행 순서를 보게 한다. 타이머는 1초 안쪽으로 둔다.
export default [
  {
    id: 'js-reference',
    chapter: 'D',
    order: 18,
    title: '참조: 같은 객체인가',
    tagline: '내용이 같아도 다른 배열',
    kind: 'practice',
    definition:
      '배열과 객체는 변수 안에 통째로 들어 있지 않고, 어디에 있는지만 들어 있다. 이것을 참조(reference)라 한다. `const b = a`는 복사가 아니라 같은 배열을 가리키는 이름을 하나 더 만든다. 배열·객체끼리의 `===`는 내용이 아니라 같은 것을 가리키는지를 묻는다.',
    goal: [
      '`const same = todos`를 만들고 `console.log(same === todos)`를 찍는다. true다. same은 복사본이 아니라 같은 배열의 다른 이름이다.',
      "`same.push({ id: 'c', title: '빨래', done: false })`를 치고 `console.log(todos.length)`를 찍는다. same에 넣었는데 todos도 3이다.",
      "고치기 전의 목록을 붙잡아 둔다: `const before = todos`. 그 아래에 `todos.push({ id: 'd', title: '청소', done: false })`를 치고 `console.log(before === todos)`를 찍는다. 내용이 바뀌었는데도 true라서, 이 비교로는 바뀐 것을 알아챌 수 없다.",
      "이번에는 새 배열을 만든다: `const after = [...todos, { id: 'e', title: '분리수거', done: false }]`, 그리고 `console.log(before === after)`. false다. 리액트는 이 false를 보고 목록이 바뀐 것을 안다.",
    ],
    starterCode: `const todos = [
  { id: 'a', title: '장보기', done: true },
  { id: 'b', title: '설거지', done: false },
]

// 내용이 똑같은 배열을 하나 더 만들었다. 둘은 같은가?
const other = [
  { id: 'a', title: '장보기', done: true },
  { id: 'b', title: '설거지', done: false },
]
console.log(todos === other)
`,
    solutionCode: `const todos = [
  { id: 'a', title: '장보기', done: true },
  { id: 'b', title: '설거지', done: false },
]

// 내용이 똑같은 배열을 하나 더 만들었다. 둘은 같은가?
const other = [
  { id: 'a', title: '장보기', done: true },
  { id: 'b', title: '설거지', done: false },
]
console.log(todos === other) // false: 내용이 같아도 다른 배열이다

const same = todos // 복사가 아니다. 같은 배열에 이름을 하나 더 붙인다
console.log(same === todos)

same.push({ id: 'c', title: '빨래', done: false })
console.log(todos.length) // 3: 같은 배열이다

// 원본을 고치면, 고치기 전과 후가 여전히 같은 배열이다
const before = todos
todos.push({ id: 'd', title: '청소', done: false })
console.log(before === todos) // true: 바뀐 것을 알아챌 수 없다

// 새 배열을 만들면 다른 배열이 된다
const after = [...todos, { id: 'e', title: '분리수거', done: false }]
console.log(before === after) // false: 바뀐 것을 안다
`,
    deeper: [
      {
        question: 'const로 만들었는데 왜 push가 되나',
        answer: `const가 막는 것은 이름이 다른 배열을 가리키게 바꾸는 일이다. 가리키는 배열의 안을 고치는 일은 막지 않는다. JS 3에서 미뤄 둔 답이 이것이다.

const todos = []
todos.push('장보기') // 된다: 같은 배열의 안을 고친다
todos = ['설거지']   // 오류: 이름이 다른 배열을 가리키게 한다`,
      },
      {
        question: '리액트는 정말 이렇게 견주나',
        answer:
          '그렇다. 리액트는 새 state를 받으면 이전 것과 같은 것인지를 === 와 거의 같은 방법(Object.is)으로 견준다. 같으면 바뀐 게 없다고 보고 다시 그리지 않는다. 그래서 push로 고친 배열을 다시 넘기면 화면이 그대로다(레슨 17). memo가 props를 견주는 방법도 같다(레슨 33). 얕은 복사가 함정이 되는 이유도 여기 있다. 바깥 배열은 새것이어도 안의 객체는 같은 것이다(레슨 16).',
      },
      {
        question: '숫자와 문자열도 이렇게 견주나',
        answer:
          "아니다. 숫자·문자열·불리언은 변수 안에 값이 그대로 들어 있어 내용으로 견준다. '장보기' === '장보기'는 true다. 참조로 견주는 것은 배열·객체·함수다.",
      },
    ],
    usedIn: [16, 17, 22, 31, 33],
    sources: [
      'https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/Strict_equality',
      'https://ko.react.dev/learn/updating-arrays-in-state',
    ],
    quiz: {
      question: 'const a = [1]; const b = a; b.push(2) 다음에 a.length는 무엇인가',
      options: ['1', '2', '오류가 난다'],
      answerIndex: 1,
      explanation: 'b는 a와 같은 배열을 가리킨다. b로 넣은 2는 a에서도 보인다.',
    },
  },
  {
    id: 'js-closure',
    chapter: 'D',
    order: 19,
    title: '클로저: 함수는 만들어질 때를 기억한다',
    tagline: '옛 값을 보는 함수',
    kind: 'practice',
    definition:
      '함수는 만들어진 자리에서 보이던 변수를 기억한다. 이것을 클로저(closure)라 한다. 나중에 불러도 그 변수를 그대로 읽는다. 함수를 부를 때마다 매개변수와 안에서 만든 이름은 새로 생기므로, 부를 때마다 만든 함수는 그때의 값을 따로따로 기억한다.',
    goal: [
      "render 안의 console.log 아래에 `return () => console.log('나중에 본 count:', count)`를 쓴다. 한 번 그릴 때마다, 나중에 부를 함수를 하나 만들어 돌려준다.",
      '돌려받은 함수를 담는다. `render(0)`을 `const first = render(0)`으로, `render(1)`을 `const second = render(1)`로 바꾼다.',
      '맨 아래에서 `first()`와 `second()`를 부른다. first는 1을 그린 뒤에 불렀는데도 0을 찍는다. 만들어질 때의 count를 기억하기 때문이다.',
      "기억하는 것은 값이 아니라 변수다. 맨 아래에 `function makeCounter() {`를 열고, 첫 줄에 `let n = 0`, 다음 줄에 `return () => {`를 쓴다. 화살표 뒤에서 여러 줄을 실행하려면 이렇게 중괄호로 감싼다(JS 9의 더 파고들면). 그 안에 `n++`와 `console.log('n:', n)`을 쓰고, `}`를 두 번 써서 화살표 함수와 makeCounter를 차례로 닫는다.",
      '그 아래에 `const next = makeCounter()`를 쓰고, 이어서 `next()`를 세 줄 쓴다. 1, 2, 3이 찍힌다.',
    ],
    starterCode: `// 화면을 한 번 그릴 때마다 이 함수가 불린다고 하자. count는 그때의 값이다.
function render(count) {
  console.log('그린다:', count)
}

render(0)
render(1)
`,
    solutionCode: `// 화면을 한 번 그릴 때마다 이 함수가 불린다고 하자. count는 그때의 값이다.
function render(count) {
  console.log('그린다:', count)
  // 이 함수는 만들어진 자리의 count를 기억한다
  return () => console.log('나중에 본 count:', count)
}

const first = render(0)
const second = render(1)

first()  // 0: 1을 그린 뒤에 불렀지만, 만들어질 때의 count를 본다
second() // 1

// 기억하는 것은 변수다. 그 변수가 바뀌면 바뀐 값을 본다
function makeCounter() {
  let n = 0
  return () => {
    n++
    console.log('n:', n)
  }
}

const next = makeCounter()
next()
next()
next()
`,
    deeper: [
      {
        question: 'state를 바꿨는데 왜 옛 값이 보이나',
        answer:
          '이 레슨의 render와 같은 일이다. 리액트는 화면을 그릴 때마다 컴포넌트 함수를 부르고, 그때의 count는 그 렌더의 const다. 그 렌더에서 만든 클릭 처리 함수는 그 count를 기억한다. 그래서 setCount를 부른 바로 다음 줄에서 count를 읽어도 옛 값이다(레슨 14). setCount((c) => c + 1)처럼 함수를 넘기면 기억한 값 대신 최신 값을 인자로 받는다(레슨 15).',
      },
      {
        question: '타이머 안에서 옛 값을 보는 것도 같은 일인가',
        answer:
          '같은 일이다. 타이머에 넘긴 함수는 만들어질 때의 값을 기억한 채 나중에 불린다. 그 사이 값이 바뀌었어도 옛 값을 본다. 레슨 30의 구독 함수도 만들어질 때의 문구를 기억한다. 그래서 문구가 바뀔 때마다 구독을 다시 열어야 했고, useEffectEvent로 떼어 내면 다시 열지 않고도 최신 문구를 읽는다. 타이머는 JS 22에서 배운다.',
      },
    ],
    usedIn: [14, 15, 27, 30, 33],
    sources: [
      'https://developer.mozilla.org/ko/docs/Web/JavaScript/Guide/Closures',
      'https://ko.react.dev/learn/state-as-a-snapshot',
    ],
    quiz: {
      question: 'const first = render(0); render(1); 다음에 first()는 무엇을 찍는가',
      options: ['0', '1', 'undefined'],
      answerIndex: 0,
      explanation: 'first는 render(0)을 부를 때 만들어졌다. 그때의 count인 0을 기억한다.',
    },
  },
  {
    id: 'js-closure-practice',
    chapter: 'D',
    order: 20,
    title: '클로저 연습: 기억한 값과 지금 값',
    tagline: '세 번 더했는데 1이다',
    kind: 'practice',
    definition:
      '함수가 기억한 값으로 계산하면, 그 뒤에 바뀐 것을 모른다. 지금 값이 필요하면 기억한 값을 쓰지 말고, 지금 값을 인자로 받는 함수를 넘긴다. 이 레슨은 JS 19의 render를 조금 키워 그 차이를 손으로 본다.',
    goal: [
      "왜 1인지 본다. render가 돌려주는 화살표 함수 안, 첫 setCount 위에 `console.log('기억한 count:', count)`를 쓴다. 세 줄 모두 0을 기억한 채 0 + 1을 넣고 있다.",
      '세 줄을 모두 `setCount((c) => c + 1)`로 바꾼다. setCount가 지금 값을 c로 넘겨 주므로 3이 찍힌다.',
      "다시 그리면 새 값을 기억한다. 맨 아래에 `const click2 = render()`와 `click2()`를 쓰고, `console.log('다시 그린 뒤:', current)`를 찍는다. 이번에 기억한 count는 3이고, 6이 찍힌다.",
    ],
    starterCode: `// 값을 담아 두는 작은 장치. current가 진짜 값이다. 리액트 레슨 14·15의 장치를 흉내 냈다.
let current = 0
function setCount(next) {
  // 함수를 받으면 지금 값을 넘겨 새 값을 받고, 아니면 받은 값을 그대로 넣는다
  current = typeof next === 'function' ? next(current) : next
}

// 한 번 그릴 때 count는 그때의 current다. 돌려주는 함수는 그 count를 기억한다(JS 19).
function render() {
  const count = current
  return () => {
    setCount(count + 1)
    setCount(count + 1)
    setCount(count + 1)
  }
}

const click = render()
click()
console.log('세 번 더했는데:', current)
`,
    solutionCode: `// 값을 담아 두는 작은 장치. current가 진짜 값이다. 리액트 레슨 14·15의 장치를 흉내 냈다.
let current = 0
function setCount(next) {
  // 함수를 받으면 지금 값을 넘겨 새 값을 받고, 아니면 받은 값을 그대로 넣는다
  current = typeof next === 'function' ? next(current) : next
}

// 한 번 그릴 때 count는 그때의 current다. 돌려주는 함수는 그 count를 기억한다(JS 19).
function render() {
  const count = current
  return () => {
    console.log('기억한 count:', count)
    // 기억한 count 대신, 지금 값을 c로 받아 1을 더한다
    setCount((c) => c + 1)
    setCount((c) => c + 1)
    setCount((c) => c + 1)
  }
}

const click = render()
click()
console.log('세 번 더했는데:', current)

// 다시 그리면 그때의 current를 새로 기억한다
const click2 = render()
click2()
console.log('다시 그린 뒤:', current)
`,
    deeper: [
      {
        question: '리액트에서는 무엇이 이 장치인가',
        answer:
          'useState가 돌려주는 두 값이 이 레슨의 count와 setCount다. 레슨 14는 setCount를 부른 뒤에도 count가 그대로인 까닭을 보고, 레슨 15의 스타터는 setCount(count + 1)을 세 번 불러도 1만 오른다. 레슨 15의 정답은 setCount((n) => n + 1)로 3을 만든다. 이 레슨의 두 단계와 같은 일이다.',
      },
      {
        question: '그럼 언제나 함수로 넘겨야 하나',
        answer:
          '앞의 값에서 새 값을 계산할 때만이다. 새 값이 앞의 값과 상관없으면(입력칸에 친 글자처럼) 그 값을 그대로 넘긴다.',
      },
    ],
    usedIn: [14, 15],
    sources: ['https://ko.react.dev/learn/queueing-a-series-of-state-updates'],
    quiz: {
      question: 'count가 0을 기억한 함수 안에서 setCount(count + 1)을 세 번 부르면 current는 얼마인가',
      options: ['1', '3', '0'],
      answerIndex: 0,
      explanation: '세 번 모두 기억한 0에 1을 더한 1을 넣는다. 지금 값에서 더하려면 setCount((c) => c + 1)처럼 함수를 넘긴다.',
    },
  },
  {
    id: 'js-modules',
    chapter: 'D',
    order: 21,
    title: '모듈: import와 export',
    tagline: '파일끼리 주고받기',
    kind: 'concept',
    definition:
      '모듈(module)은 파일 하나다. `export`로 내보낸 것만 다른 파일에서 `import`로 가져다 쓸 수 있다. 파일마다 이름이 따로라서, 두 파일에 같은 이름이 있어도 부딪히지 않는다.',
    goal: '두 파일을 나란히 읽는다. 왼쪽 파일이 내보내고 오른쪽 파일이 가져온다. 이 앱의 편집기는 파일이 하나뿐이라 import를 실행할 수 없어서, 이 레슨은 읽기만 한다.',
    figure: {
      steps: [
        { title: 'todo.js', note: 'export로 label과 countLeft를 내보낸다' },
        { title: 'import', note: "main.js가 './todo.js'에서 가져온다" },
        { title: 'main.js', note: '가져온 함수를 제 것처럼 부른다' },
      ],
      caption: '내보내지 않은 DONE_MARK는 main.js에서 보이지 않는다.',
    },
    readOnly: [
      {
        filename: 'todo.js',
        code: `// 이 파일에서만 쓰는 이름. export가 없으므로 밖에서 못 본다
const DONE_MARK = ' · 끝'

// 이름을 붙여 내보낸다 (named export)
export function label(todo) {
  return todo.done ? todo.title + DONE_MARK : todo.title
}

// 이 파일의 대표 하나를 내보낸다 (default export)
export default function countLeft(todos) {
  return todos.filter((todo) => !todo.done).length
}
`,
      },
      {
        filename: 'main.js',
        code: `// 대표(default)는 중괄호 없이, 원하는 이름으로 받는다
// 이름 붙인 것(named)은 중괄호 안에 그 이름 그대로 받는다
import countLeft, { label } from './todo.js'

const todos = [
  { id: 'a', title: '장보기', done: true },
  { id: 'b', title: '설거지', done: false },
]

console.log(todos.map(label)) // 함수를 값으로 넘긴다(JS 9)
console.log(countLeft(todos))
`,
      },
    ],
    deeper: [
      {
        question: "import { useState } from 'react'는 무엇을 가져오나",
        answer:
          "react라는 모듈이 이름 붙여 내보낸 useState를 가져온다. 파일 경로 대신 패키지 이름을 쓰면 설치된 라이브러리에서 찾는다. 리액트 컴포넌트 파일도 모듈이라, 컴포넌트를 export하고 다른 파일에서 import한다. 레슨 4에서 본다.",
      },
      {
        question: '이 앱의 편집기에서는 왜 import 없이 useState를 쓰나',
        answer:
          '앱이 미리 넣어 두었기 때문이다. 실제 프로젝트에서는 파일 맨 위에 import 줄을 쓴다. 이 앱에서 import를 치면 실행 오류가 난다.',
      },
    ],
    usedIn: [4, 39],
    sources: ['https://developer.mozilla.org/ko/docs/Web/JavaScript/Guide/Modules'],
    quiz: {
      question: 'export default로 내보낸 countLeft를 가져오는 줄은 무엇인가',
      options: [
        "import { countLeft } from './todo.js'",
        "import countLeft from './todo.js'",
        "import './todo.js'",
      ],
      answerIndex: 1,
      explanation: '대표(default)는 중괄호 없이 받는다. 중괄호는 이름 붙여 내보낸 것을 받을 때 쓴다.',
    },
  },
  {
    id: 'js-timers',
    chapter: 'D',
    order: 22,
    title: '타이머: setTimeout과 setInterval',
    tagline: '지금이 아니라 나중에',
    kind: 'practice',
    definition:
      '`setTimeout(함수, 밀리초)`는 그만큼 뒤에 함수를 한 번 부르고, `setInterval(함수, 밀리초)`는 그 간격으로 계속 부른다. 1000밀리초가 1초다. 둘 다 번호를 돌려주고, 그 번호를 `clearTimeout`·`clearInterval`에 넘기면 멈춘다. 타이머에 넘긴 함수는 지금 실행 중인 코드가 끝까지 돈 뒤에야 불린다.',
    goal: [
      "알림 줄을 `setTimeout(() => console.log('장보기 알림'), 500)`으로 바꾼다. '시작'과 '끝'이 먼저 찍히고, 0.5초 뒤에 알림이 '나중' 표시를 달고 찍힌다.",
      "500을 0으로 바꿔 본다. 0이어도 '끝' 뒤에 찍힌다. 확인했으면 500으로 돌린다.",
      "맨 아래에서 `feed.open()`을 부른다. 0.3초마다 '소식'이 찍히고, 멈추지 않는다.",
      '그 아래에 `setTimeout(() => feed.close(), 1000)`을 쓴다. 1초 뒤에 구독을 닫아 소식이 멈춘다.',
    ],
    starterCode: `console.log('시작')
console.log('장보기 알림')
console.log('끝')

// 0.3초마다 소식을 찍는 가짜 구독. 리액트 레슨 29와 같은 모양이다.
// 객체 안의 open() { ... }은 open: function () { ... }을 줄여 쓴 것이다.
let timer
const feed = {
  open() {
    let n = 0
    timer = setInterval(() => {
      n++
      console.log('소식', n)
    }, 300)
  },
  close() {
    clearInterval(timer) // setInterval이 돌려준 번호로 멈춘다
    console.log('구독 끝')
  },
}
`,
    solutionCode: `console.log('시작')
setTimeout(() => console.log('장보기 알림'), 500) // 0.5초 뒤에 한 번
console.log('끝')

// 0.3초마다 소식을 찍는 가짜 구독. 리액트 레슨 29와 같은 모양이다.
// 객체 안의 open() { ... }은 open: function () { ... }을 줄여 쓴 것이다.
let timer
const feed = {
  open() {
    let n = 0
    timer = setInterval(() => {
      n++
      console.log('소식', n)
    }, 300)
  },
  close() {
    clearInterval(timer) // setInterval이 돌려준 번호로 멈춘다
    console.log('구독 끝')
  },
}

feed.open()
setTimeout(() => feed.close(), 1000) // 1초 뒤에 닫는다
`,
    deeper: [
      {
        question: '0밀리초로 걸어도 왜 나중에 찍히나',
        answer:
          'JS는 한 번에 한 가지 일만 한다. 지금 실행 중인 코드가 끝까지 돌아야 다음 차례가 오고, 타이머의 함수는 그 뒤에 줄을 선다. 그래서 0으로 걸어도 "지금 코드가 다 끝난 뒤"에 불린다.',
      },
      {
        question: '닫지 않으면 어떻게 되나',
        answer:
          '계속 돈다. 이 앱에서는 편집하거나 레슨을 옮길 때 앱이 타이머를 대신 멈춘다. 하지만 실제 페이지에서는 아무도 멈추지 않는다. 리액트에서는 컴포넌트가 사라져도 타이머가 남는다. 그래서 레슨 29는 Effect의 정리 함수에서 close를 부른다.',
      },
    ],
    usedIn: [29, 30, 31, 35],
    sources: [
      'https://developer.mozilla.org/ko/docs/Web/API/Window/setTimeout',
      'https://developer.mozilla.org/ko/docs/Web/API/Window/setInterval',
    ],
    quiz: {
      question: "console.log('A'); setTimeout(() => console.log('B'), 0); console.log('C')는 어떤 순서로 찍히는가",
      options: ['A B C', 'A C B', 'B A C'],
      answerIndex: 1,
      explanation: '타이머의 함수는 지금 코드가 끝난 뒤에 불린다. 0밀리초여도 C 다음이다.',
    },
  },
  {
    id: 'js-promise',
    chapter: 'D',
    order: 23,
    title: 'Promise: 나중에 오는 값',
    tagline: '값 대신 약속을 돌려준다',
    kind: 'practice',
    definition:
      'Promise는 나중에 올 값을 담는 상자다. `new Promise((resolve, reject) => { ... })`로 만들고, 값이 준비되면 `resolve(값)`을, 실패하면 `reject(오류)`를 부른다. 받는 쪽은 `.then(함수)`로 값을 받고 `.catch(함수)`로 오류를 받는다.',
    goal: [
      'fetchTodos 안의 setTimeout 줄 위에 `return new Promise((resolve, reject) => {`를, 아래에 `})`를 쓴다. setTimeout 줄이 그 사이에 들어간다. 콘솔 출력은 아직 전과 같다.',
      "매개변수 이름 onDone을 fail로 바꾼다. 그리고 setTimeout 줄의 `onDone([...])` 부분을 `{`와 `}`로 바꾸고, 그 중괄호 안에 두 줄을 쓴다: `if (fail) reject(new Error('서버가 응답하지 않는다'))`와 `else resolve(['장보기', '설거지'])`. 닫는 `}` 뒤에는 원래 있던 `, 500)`이 그대로 이어진다. 실행할 줄이 하나면 else도 중괄호 없이 쓸 수 있다. 다음 단계에서 부르는 줄을 고치기 전까지는 콘솔에 오류 줄이 보일 수 있다.",
      "부르는 줄을 `fetchTodos(false).then((todos) => console.log('받음:', todos))`로 바꾼다.",
      "실패하는 요청도 보낸다: `fetchTodos(true)` 뒤에 `.then(...)`을 똑같이 붙이고, 그 뒤에 `.catch((err) => console.log('실패:', err.message))`를 붙인다.",
      "맨 아래에 `console.log('기다리는 동안 다른 일을 한다')`를 찍는다. 이 줄이 결과보다 먼저 찍힌다.",
    ],
    starterCode: `// 0.5초 뒤에 할 일 목록을 주는 가짜 서버. 결과는 넘겨받은 함수(onDone)를 불러 알려 준다.
function fetchTodos(onDone) {
  setTimeout(() => onDone(['장보기', '설거지']), 500)
}

console.log('요청 보냄')
fetchTodos((todos) => console.log('받음:', todos))
`,
    solutionCode: `// 0.5초 뒤에 할 일 목록을 주는 가짜 서버. 이제 결과 대신 Promise를 돌려준다.
function fetchTodos(fail) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (fail) reject(new Error('서버가 응답하지 않는다')) // 실패를 알린다
      else resolve(['장보기', '설거지']) // 값이 준비됐다
    }, 500)
  })
}

console.log('요청 보냄')
fetchTodos(false).then((todos) => console.log('받음:', todos))

fetchTodos(true)
  .then((todos) => console.log('받음:', todos))
  .catch((err) => console.log('실패:', err.message))

console.log('기다리는 동안 다른 일을 한다')
`,
    before: {
      text: 'Promise가 생기기 전(2015년 이전)에는 결과를 받을 함수를 넘겼다. 이런 함수를 콜백(callback)이라 한다. 기다릴 일이 이어지면 콜백 안에 콜백을 넣었다.',
      code: `// 목록을 받고, 그다음 첫 할 일의 자세한 정보를 받고, 그다음 저장한다
fetchTodos((todos) => {
  fetchDetail(todos[0], (detail) => {
    save(detail, (result) => {
      console.log('끝', result)
    })
  })
})
`,
    },
    why: [
      '기다릴 일이 하나 늘 때마다 콜백이 한 겹 더 들어가 코드가 오른쪽으로 밀렸다. 실패를 알리는 방법도 함수마다 제각각이라 오류를 한곳에서 받을 수 없었다.',
      'Promise는 "나중에 올 값"을 값으로 돌려준다. 받는 쪽은 .then을 이어 붙이고, 실패는 .catch 하나로 받는다. 다음 레슨의 async와 await가 이것을 더 평평하게 만든다.',
    ],
    deeper: [
      {
        question: 'resolve를 끝내 부르지 않으면',
        answer:
          '.then에 넘긴 함수가 영영 불리지 않는다. 오류도 나지 않는다. 화면이 "불러오는 중"에서 멈춰 있으면 이것을 의심한다.',
      },
      {
        question: '리액트에서는 어디서 쓰나',
        answer:
          '레슨 35의 fakeSave가 이 레슨의 fetchTodos와 같은 모양이다. 제목에 느낌표가 있으면 reject하고, 아니면 resolve한다. 레슨 37은 서버에서 목록을 받는 척하는 Promise를 만들고 use로 읽는다.',
      },
    ],
    usedIn: [35, 36, 37],
    sources: [
      'https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Promise',
      'https://developer.mozilla.org/ko/docs/Web/JavaScript/Guide/Using_promises',
    ],
    quiz: {
      question: 'Promise 안에서 resolve(값)을 부르면 그 값은 어디로 가는가',
      options: [
        '콘솔에 찍힌다',
        '.then에 넘긴 함수의 인자로 간다',
        'new Promise를 쓴 줄로 돌아온다',
      ],
      answerIndex: 1,
      explanation: 'resolve로 넘긴 값은 .then에 넘긴 함수가 인자로 받는다.',
    },
  },
  {
    id: 'js-async-await',
    chapter: 'D',
    order: 24,
    title: 'async와 await',
    tagline: '기다리는 코드를 위에서 아래로',
    kind: 'practice',
    definition:
      '`async function`은 안에서 `await`를 쓸 수 있는 함수다. `await Promise`는 그 Promise가 값을 줄 때까지 함수의 다음 줄을 멈춰 두고, 받은 값을 그 자리에 둔다. Promise가 실패하면 그 자리에서 오류를 던지므로 try/catch로 받는다. 멈추는 것은 그 함수 안뿐이고 바깥 코드는 계속 간다.',
    goal: [
      "같은 일을 async 함수로 쓴다. `async function load(fail) {`를 열고, 안에 `const todos = await fetchTodos(fail)`, `console.log('받음:', todos)`, `console.log('개수:', todos.length)`를 한 줄씩 쓰고 `}`로 닫는다.",
      '`fetchTodos(false)`부터 `.catch(...)`까지 then으로 이은 부분을 지우고, 그 자리에서 `load(false)`를 부른다. 결과는 같다.',
      "실패를 받는다. load 안의 세 줄을 `try {`와 `}` 사이로 옮기고, 이어서 `catch (err) {`를 열고 `console.log('실패:', err.message)`를 쓴 뒤 `}`로 닫는다. 그리고 `load(false)` 아래에 `load(true)`도 부른다.",
      "맨 아래에 `console.log('기다리는 동안 다른 일을 한다')`를 찍는다. await는 load 안만 멈추므로 이 줄이 먼저 찍힌다.",
    ],
    starterCode: `function fetchTodos(fail) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (fail) reject(new Error('서버가 응답하지 않는다'))
      else resolve(['장보기', '설거지'])
    }, 500)
  })
}

console.log('요청 보냄')

// 받은 목록을 찍고, 이어서 개수를 센다. then을 이어 붙였다.
fetchTodos(false)
  .then((todos) => {
    console.log('받음:', todos)
    return todos.length
  })
  .then((count) => console.log('개수:', count))
  .catch((err) => console.log('실패:', err.message))
`,
    solutionCode: `function fetchTodos(fail) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (fail) reject(new Error('서버가 응답하지 않는다'))
      else resolve(['장보기', '설거지'])
    }, 500)
  })
}

console.log('요청 보냄')

async function load(fail) {
  try {
    const todos = await fetchTodos(fail) // 값이 올 때까지 이 함수만 멈춘다
    console.log('받음:', todos)
    console.log('개수:', todos.length)
  } catch (err) {
    console.log('실패:', err.message) // reject는 await 자리에서 던진 오류가 된다
  }
}

load(false)
load(true)

console.log('기다리는 동안 다른 일을 한다')
`,
    before: {
      text: 'async와 await가 생기기 전(2017년 이전)에는 .then을 사슬로 이었다. 단계마다 새 함수라서, 앞 단계의 결과를 뒤에서 쓰려면 바깥 변수에 옮겨 담아야 했다.',
      code: `let saved // 앞의 결과를 뒤에서 쓰려고 바깥에 옮겨 담는다

fetchTodos(false)
  .then((todos) => {
    saved = todos
    return fetchDetail(todos[0])
  })
  .then((detail) => {
    console.log(saved.length, detail) // 바깥 변수를 거쳐야 todos를 본다
  })
`,
    },
    why: [
      'then 사슬은 단계마다 새 함수라서 이름이 단계 안에 갇혔다. 앞 단계의 값을 쓰려면 바깥 변수를 거쳐야 했고, 오류 처리는 사슬 끝의 .catch로 따로 갔다.',
      'await는 기다리는 코드를 위에서 아래로 읽히게 쓴다. 받은 값은 그냥 const로 남고, 오류는 JS 10의 try/catch로 받는다. 레슨 35의 addTodo가 이 모양이다.',
    ],
    deeper: [
      {
        question: 'await를 async 함수 밖에서 쓰면',
        answer:
          '이 앱의 편집기에서는 실행 오류가 난다. await는 async를 붙인 함수 안에서만 쓸 수 있다. 감싼 함수 앞에 async를 붙인다. (모듈 파일의 맨 바깥에서는 쓸 수 있는데, 이 편집기는 모듈이 아니다.)',
      },
      {
        question: 'async 함수는 무엇을 돌려주나',
        answer: `언제나 Promise를 돌려준다. 안에서 return한 값은 그 Promise가 나중에 주는 값이 된다. 그래서 async 함수의 결과를 받으려면 다시 await하거나 .then을 붙인다.

async function count() {
  return 3
}
console.log(count())                    // 3이 아니라 Promise가 찍힌다
count().then((n) => console.log(n))     // 3`,
      },
    ],
    usedIn: [35, 36, 39],
    sources: [
      'https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Statements/async_function',
      'https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/await',
    ],
    quiz: {
      question: 'async 함수 안의 await가 멈추는 것은 무엇인가',
      options: ['페이지 전체', '그 async 함수의 다음 줄', '다른 모든 타이머'],
      answerIndex: 1,
      explanation: '그 함수 안에서만 기다린다. 함수 밖의 코드와 다른 타이머는 계속 돈다.',
    },
  },
  {
    id: 'js-async-practice',
    chapter: 'D',
    order: 25,
    title: '비동기 연습: 차례로 저장하기',
    tagline: '기다리고, 실패를 받고, 끝을 알린다',
    kind: 'practice',
    definition:
      'await를 차례로 쓰면 앞의 일이 끝나야 다음 일이 시작된다. 실패는 try/catch로 받고, 성공이든 실패든 "끝났다"는 표시는 try/catch 뒤에 둔다. 리액트 레슨 35가 할 일을 저장할 때 하는 일이 이것이다.',
    goal: [
      'add 앞에 async를 붙인다. 그리고 `fakeSave(title)` 줄과 `saved.push(title)` 줄을 `const result = await fakeSave(title)`와 `saved.push(result)`로 바꾼다. 이제 저장이 끝난 뒤에 목록에 넣는다.',
      "부르는 쪽을 async 함수로 감싼다. `async function main() {`를 열고 그 안에 `await add('장보기')`, `await add('설거지!')`, `await add('빨래')`를 한 줄씩 쓴다. 원래 있던 `add('장보기')` 줄은 지우고, 마지막 console.log 줄을 main 안 맨 아래로 옮긴 뒤 `}`로 닫는다. 그 아래에 `main()`을 쓴다. '설거지!'에서 오류가 나고, 빨래는 저장되지 않는다.",
      "add 안의 두 줄(await 줄과 push 줄)을 `try {`와 `}` 사이로 옮긴다. 이어서 `catch (err) {`를 열고 `console.log('실패:', title, err.message)`를 쓴 뒤 `}`로 닫는다. `saving = false`는 try/catch 아래에 그대로 둔다. 성공해도 실패해도 그 줄을 지나므로, 끝에 '저장 중: false'가 찍힌다.",
    ],
    starterCode: `// 0.3초 뒤에 저장되는 가짜 서버. 느낌표가 있으면 실패한다. 리액트 레슨 35와 같은 모양이다.
function fakeSave(title) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (title.includes('!')) reject(new Error('느낌표는 저장할 수 없다'))
      else resolve(title)
    }, 300)
  })
}

const saved = []
let saving = false // 저장하는 중인가

// 기다리지 않는다. 저장이 끝나기도 전에 목록에 넣고, 저장 중 표시를 내린다.
function add(title) {
  saving = true
  console.log('저장 시작:', title)
  fakeSave(title)
  saved.push(title)
  saving = false
}

add('장보기')
console.log('저장된 것:', saved, '저장 중:', saving)
`,
    solutionCode: `// 0.3초 뒤에 저장되는 가짜 서버. 느낌표가 있으면 실패한다. 리액트 레슨 35와 같은 모양이다.
function fakeSave(title) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (title.includes('!')) reject(new Error('느낌표는 저장할 수 없다'))
      else resolve(title)
    }, 300)
  })
}

const saved = []
let saving = false // 저장하는 중인가

async function add(title) {
  saving = true
  console.log('저장 시작:', title)
  try {
    const result = await fakeSave(title) // 저장이 끝날 때까지 이 함수만 기다린다
    saved.push(result)
  } catch (err) {
    console.log('실패:', title, err.message)
  }
  saving = false // 성공해도 실패해도 여기로 온다
}

async function main() {
  await add('장보기') // 앞의 저장이 끝나야 다음으로 간다
  await add('설거지!')
  await add('빨래')
  console.log('저장된 것:', saved, '저장 중:', saving)
}

main()
`,
    deeper: [
      {
        question: 'await 없이 셋을 한꺼번에 부르면',
        answer:
          '셋이 동시에 시작하고, 먼저 끝난 것이 saving을 false로 내린다. 나머지는 아직 저장하는 중인데도 "저장 중 아님"이 된다. 여러 일이 겹치면 이런 표시 하나로는 모자란다. 리액트 레슨 35의 useActionState는 이 표시를 대신 관리해 준다.',
      },
      {
        question: '저장 중 표시는 어디에 쓰나',
        answer:
          '화면에서 버튼을 잠그거나 "저장 중…"을 보여 줄 때 쓴다. 버튼을 두 번 눌러 두 번 저장되는 일을 막는다. 레슨 35와 36이 이 표시로 버튼과 목록을 바꾼다.',
      },
    ],
    usedIn: [35, 36],
    sources: [
      'https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Statements/async_function',
      'https://ko.react.dev/reference/react/useActionState',
    ],
    quiz: {
      question: "await add('설거지!')가 실패했지만 add 안의 catch가 받았다. 다음 줄 await add('빨래')는 어떻게 되는가",
      options: ['실행되지 않는다', '실행된다. 오류는 add 안에서 이미 받았다', '설거지!를 다시 저장한다'],
      answerIndex: 1,
      explanation: 'add가 오류를 스스로 받았으므로 main에는 오류가 오지 않는다. main은 다음 줄로 간다.',
    },
    // 챕터 D 스스로 해보기: 할 일 단계 없이 목표 출력만 준다
    challenge: {
      goal: "챕터 D에서 배운 것만으로 쓴다. 0.2초 뒤 목록을 주는 fetchTodos가 있다. async 함수 load(fail)을 만든다. 부르면 먼저 '불러오는 중'을 찍고, 목록을 받으면 그 개수와 '다 불러왔다'를 찍고, 실패하면 '실패:'와 오류 메시지를 찍는다. 아래 main이 그대로 돌아 아래 다섯 줄이 찍히게 한다.",
      target: '불러오는 중\n2\n다 불러왔다\n불러오는 중\n실패: 서버가 응답하지 않는다',
      starterCode: `function fetchTodos(fail) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (fail) reject(new Error('서버가 응답하지 않는다'))
      else resolve(['장보기', '설거지'])
    }, 200)
  })
}

// 여기에 load 함수를 만든다


// 아래는 그대로 둔다. 첫째는 성공하고, 둘째는 실패한다.
async function main() {
  await load(false)
  await load(true)
}
main()
`,
      solutionCode: `function fetchTodos(fail) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (fail) reject(new Error('서버가 응답하지 않는다'))
      else resolve(['장보기', '설거지'])
    }, 200)
  })
}

async function load(fail) {
  console.log('불러오는 중')
  try {
    const todos = await fetchTodos(fail)
    console.log(todos.length)
    console.log('다 불러왔다')
  } catch (err) {
    console.log('실패:', err.message)
  }
}

// 아래는 그대로 둔다. 첫째는 성공하고, 둘째는 실패한다.
async function main() {
  await load(false)
  await load(true)
}
main()
`,
    },
  },
]
