// JS 기초 챕터 C. 데이터 묶기. 할 일이 객체가 되고, 객체의 배열이 되고, 새 배열로 바뀌고, 글자로 저장된다.
// 목록의 모양은 리액트 레슨 17과 같다. 이 챕터를 마치면 그 정답 코드를 읽을 수 있어야 한다.
export default [
  {
    id: 'js-arrays',
    chapter: 'C',
    order: 11,
    title: '배열: 순서 있는 목록',
    tagline: '[값, 값, 값]',
    kind: 'practice',
    definition:
      '배열(array)은 값을 순서대로 담은 목록이다. `[값, 값, 값]`으로 만들고, `배열[번호]`로 하나를 꺼낸다. 번호는 0부터 센다. `length` 속성은 항목의 개수다.',
    goal: [
      "셋을 한 목록으로 묶는다: `const todos = ['장보기', '설거지', '빨래']`. 위의 `const todo1`부터 세 줄은 지우고, 그 이름을 쓰던 console.log 줄도 지운다.",
      '`console.log(todos)`로 목록 전체를, `console.log(todos[0])`과 `console.log(todos[2])`로 첫째와 셋째를 찍는다. 첫째가 0번이다.',
      "개수 줄을 `console.log('할 일 ' + todos.length + '개')`로 바꾼다. 목록이 늘면 개수가 저절로 따라온다.",
      '`console.log(todos[5])`를 찍어, 없는 번호를 꺼내면 무엇이 오는지 본다.',
    ],
    starterCode: `// 할 일이 셋이다. 이름을 셋 따로 만들었다.
const todo1 = '장보기'
const todo2 = '설거지'
const todo3 = '빨래'

console.log(todo1, todo2, todo3)
console.log('할 일 3개') // 할 일이 늘면 이 숫자도 손으로 고쳐야 한다
`,
    solutionCode: `// 순서 있는 목록. 번호는 0부터 센다
const todos = ['장보기', '설거지', '빨래']

console.log(todos)
console.log(todos[0]) // 첫째
console.log(todos[2]) // 셋째

console.log('할 일 ' + todos.length + '개')

console.log(todos[5]) // 없는 번호: undefined
`,
    deeper: [
      {
        question: '번호는 왜 0부터인가',
        answer:
          '번호가 "맨 앞에서 몇 칸 떨어졌나"를 뜻하기 때문이다. 첫째는 0칸 떨어져 있다. 그래서 마지막 항목은 todos[todos.length - 1]이다.',
      },
      {
        question: 'const로 만든 배열인데 안을 바꿀 수 있나',
        answer:
          '바꿀 수 있다. JS 3에서 본 대로 const가 막는 것은 이름에 다른 값을 다시 넣는 일뿐이다. 배열 안을 고치는 메서드는 JS 14에서, 그것이 리액트에서 왜 문제가 되는지는 JS 18에서 본다.',
      },
    ],
    usedIn: [9, 17, 22],
    sources: ['https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array'],
    quiz: {
      question: "const todos = ['장보기', '설거지', '빨래']일 때 todos[1]은 무엇인가",
      options: ['장보기', '설거지', '빨래'],
      answerIndex: 1,
      explanation: '번호는 0부터 센다. 0번이 장보기, 1번이 설거지다.',
    },
  },
  {
    id: 'js-objects',
    chapter: 'C',
    order: 12,
    title: '객체: 이름표 붙은 묶음',
    tagline: '{ 키: 값 }',
    kind: 'practice',
    definition:
      '객체(object)는 값마다 이름표를 붙여 묶은 것이다. 이 이름표를 키(key)라 한다. `{ 키: 값, 키: 값 }`으로 만들고 `객체.키`로 꺼낸다. 키와 값 한 쌍을 속성이라 한다. JS 5에서 본 문자열의 `length`도 속성이었다.',
    goal: [
      "셋을 한 객체로 묶는다: `const todo = { id: 'a', title: '장보기', done: true }`. 위의 세 줄과 그 아래 console.log는 지운다.",
      '`console.log(todo)`와 `console.log(todo.title)`을 찍는다.',
      '`todo.done = false`로 속성 하나를 바꾸고 다시 `console.log(todo)`를 찍는다. const인데도 안의 속성은 바뀐다. 까닭은 JS 18에서 본다.',
      "할 일 셋을 객체의 배열로 만든다. `const todos = [`를 열고, 다음 줄부터 `{ id: 'a', title: '장보기', done: true },`처럼 한 줄에 하나씩 셋을 쓰고(b는 설거지, c는 빨래, 둘 다 false), `]`로 닫는다. 그리고 `console.log(todos[1].title)`로 둘째의 제목을 꺼낸다.",
    ],
    starterCode: `// 할 일 하나의 정보가 이름 셋으로 흩어져 있다.
const id = 'a'
const title = '장보기'
const done = true

console.log(id, title, done)
`,
    solutionCode: `// 할 일 하나를 이름표 붙은 묶음으로
const todo = { id: 'a', title: '장보기', done: true }

console.log(todo)
console.log(todo.title) // 키로 꺼낸다

todo.done = false // 속성 하나를 바꾼다
console.log(todo)

// 할 일 여러 개는 객체의 배열이다. 리액트 레슨 17의 목록과 같은 모양이다
const todos = [
  { id: 'a', title: '장보기', done: true },
  { id: 'b', title: '설거지', done: false },
  { id: 'c', title: '빨래', done: false },
]
console.log(todos[1].title) // 1번 항목의 title
`,
    deeper: [
      {
        question: '없는 키를 꺼내면 어떻게 되나',
        answer:
          'undefined가 나온다. 오류가 나지 않으므로 todo.titel처럼 철자를 틀려도 조용하다. 화면에 아무것도 안 나올 때 가장 먼저 의심할 곳이다.',
      },
      {
        question: '키를 변수로 고르려면 어떻게 하나',
        answer: `점 대신 대괄호를 쓴다. 대괄호 안에는 키 이름을 글자로 넣거나, 키 이름이 든 변수를 넣는다.

const key = 'title'
console.log(todo['title']) // todo.title과 같다
console.log(todo[key])     // 변수에 든 키로 꺼낸다`,
      },
    ],
    usedIn: [7, 9, 16],
    sources: ['https://developer.mozilla.org/ko/docs/Learn_web_development/Core/Scripting/Object_basics'],
    quiz: {
      question: "const todo = { title: '장보기', done: true }일 때 todo.done은 무엇인가",
      options: ["'done'이라는 글자", 'true', 'undefined'],
      answerIndex: 1,
      explanation: '점 뒤의 이름은 키다. done이라는 키에 붙은 값 true가 나온다.',
    },
  },
  {
    id: 'js-map',
    chapter: 'C',
    order: 13,
    title: 'map: 배열을 새 배열로',
    tagline: '항목 하나를 이렇게 바꾼다',
    kind: 'practice',
    definition:
      '`배열.map(함수)`는 배열의 항목마다 함수를 불러, 함수가 돌려준 값들로 새 배열을 만든다. 원본 배열은 그대로 둔다.',
    goal: [
      '`const titles =` 오른쪽의 `[todos[0].title, todos[1].title, todos[2].title]`을 지우고, 그 자리에 `todos.map((todo) => todo.title)`을 쓴다. 결과는 같고, 할 일이 늘어도 고칠 곳이 없다.',
      "끝난 것에 표시를 붙인 목록을 만든다: `const labels = todos.map((todo) => (todo.done ? todo.title + ' - 끝' : todo.title))`, 그리고 `console.log(labels)`.",
      '`console.log(todos)`를 찍어 원본이 그대로인지 본다.',
    ],
    starterCode: `const todos = [
  { id: 'a', title: '장보기', done: true },
  { id: 'b', title: '설거지', done: false },
  { id: 'c', title: '빨래', done: false },
]

// 제목만 뽑은 목록이 필요하다. 지금은 하나씩 손으로 옮겼다.
const titles = [todos[0].title, todos[1].title, todos[2].title]
console.log(titles)
`,
    solutionCode: `const todos = [
  { id: 'a', title: '장보기', done: true },
  { id: 'b', title: '설거지', done: false },
  { id: 'c', title: '빨래', done: false },
]

// 항목(todo) 하나를 받아 그 title을 돌려준다. map이 항목마다 부른다
const titles = todos.map((todo) => todo.title)
console.log(titles)

const labels = todos.map((todo) => (todo.done ? todo.title + ' - 끝' : todo.title))
console.log(labels)

console.log(todos) // 원본은 그대로다
`,
    before: {
      text: 'map을 쓰기 전에는 for 문으로 번호를 하나씩 올리며, 빈 배열에 push로 하나씩 넣었다. for 문은 이 트랙에서 다루지 않고, push는 JS 14에서 본다. 지금도 오래된 코드에서 자주 보인다.',
      code: `const titles = []
for (let i = 0; i < todos.length; i++) {
  titles.push(todos[i].title)
}
`,
    },
    why: [
      '무엇을 만드는지(제목 목록)보다 어떻게 도는지(번호, 멈출 조건, 하나 올리기)가 먼저 보였다. 번호를 한 칸 잘못 세면 조용히 틀렸다.',
      'map을 쓰면 "항목 하나를 이렇게 바꾼다"만 쓰면 된다. 리액트는 목록을 화면으로 바꿀 때 이것을 쓴다. 레슨 9의 `todos.map((todo) => <li>...</li>)`가 같은 모양이다.',
    ],
    deeper: [
      {
        question: 'map에 넘긴 함수는 누가 부르나',
        answer: `map이 항목마다 부른다. JS 9의 twice처럼, 함수를 넘기면 받은 쪽이 부른다. 항목과 함께 번호도 둘째 인자로 넘겨 준다.

const numbered = todos.map((todo, i) => i + '. ' + todo.title)
console.log(numbered) // ['0. 장보기', '1. 설거지', '2. 빨래']`,
      },
      {
        question: 'map에 넘긴 함수가 아무것도 돌려주지 않으면 어떻게 되나',
        answer:
          '항목마다 undefined가 들어간 배열이 된다. 화살표 뒤에 중괄호를 쓰고 return을 빠뜨리는 실수가 흔하다(JS 9). 리액트에서 목록이 통째로 안 보이면 이것부터 본다.',
      },
    ],
    usedIn: [9, 17, 22],
    sources: ['https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/map'],
    quiz: {
      question: '[1, 2, 3].map((n) => n + n)의 결과는 무엇인가',
      options: ['[1, 2, 3]', '[2, 4, 6]', '12'],
      answerIndex: 1,
      explanation: '항목마다 n + n을 돌려받아 새 배열을 만든다. 원본 [1, 2, 3]은 그대로다.',
    },
  },
  {
    id: 'js-filter-find',
    chapter: 'C',
    order: 14,
    title: 'filter·find, 원본을 바꾸는 메서드',
    tagline: '고르기, 찾기, 그리고 push',
    kind: 'practice',
    definition:
      '`filter(함수)`는 함수가 true를 돌려준 항목만 모아 새 배열을 만들고, `find(함수)`는 처음으로 true가 된 항목 하나를 돌려준다. 둘 다 원본을 그대로 둔다. 반면 `push(항목)`는 원본 배열 끝에 항목을 붙여 원본 자체를 고친다. 중간의 항목을 빼는 `splice`도 원본을 고친다.',
    goal: [
      '남은 것만 모은다: `const left = todos.filter((todo) => !todo.done)`, 그리고 `console.log(left.length)`로 개수를 찍는다.',
      "id가 'b'인 할 일을 찾는다: `console.log(todos.find((todo) => todo.id === 'b'))`.",
      "지우기를 filter로 한다: `const withoutA = todos.filter((todo) => todo.id !== 'a')`, 그리고 `console.log(withoutA.length, todos.length)`. 원본은 그대로 3이다.",
      "이번에는 원본을 고친다: `todos.push({ id: 'd', title: '청소', done: false })`, 그리고 `console.log(todos.length)`. push는 새 배열을 만들지 않고 todos 자체에 붙인다.",
    ],
    starterCode: `const todos = [
  { id: 'a', title: '장보기', done: true },
  { id: 'b', title: '설거지', done: false },
  { id: 'c', title: '빨래', done: false },
]

console.log(todos.map((todo) => todo.title))
`,
    solutionCode: `const todos = [
  { id: 'a', title: '장보기', done: true },
  { id: 'b', title: '설거지', done: false },
  { id: 'c', title: '빨래', done: false },
]

console.log(todos.map((todo) => todo.title))

// true를 돌려준 항목만 모은 새 배열
const left = todos.filter((todo) => !todo.done)
console.log(left.length)

// 처음으로 true가 된 항목 하나
console.log(todos.find((todo) => todo.id === 'b'))

// 지우기: 'a'가 아닌 것만 남긴 새 배열. 원본은 그대로다
const withoutA = todos.filter((todo) => todo.id !== 'a')
console.log(withoutA.length, todos.length)

// push는 원본 자체를 고친다
todos.push({ id: 'd', title: '청소', done: false })
console.log(todos.length)
`,
    deeper: [
      {
        question: 'filter와 find는 결과가 어떻게 다른가',
        answer:
          "filter는 언제나 배열을 돌려준다. 맞는 것이 없으면 빈 배열 []이다. find는 항목 하나를 돌려주고, 맞는 것이 없으면 undefined다. 그래서 find의 결과에서 바로 .title을 꺼내면, 못 찾았을 때 오류가 난다.",
      },
      {
        question: '리액트에서 push를 쓰면 왜 안 되나',
        answer:
          '리액트는 새 배열을 받았는지로 목록이 바뀐 것을 안다. push는 같은 배열을 고치므로 리액트가 바뀐 줄 모르고 화면을 다시 그리지 않는다. 그래서 레슨 17은 push 대신 새 배열을 만드는 filter·map·스프레드를 쓴다. 스프레드는 JS 16, "같은 배열"이 무슨 뜻인지는 JS 18에서 본다.',
      },
    ],
    usedIn: [10, 17, 21],
    sources: [
      'https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/filter',
      'https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/find',
    ],
    quiz: {
      question: 'todos.filter((todo) => todo.done)이 돌려주는 것은 무엇인가',
      options: [
        '끝난 할 일 하나',
        '끝난 할 일만 담은 새 배열',
        '안 끝난 것을 지운 원본 todos',
      ],
      answerIndex: 1,
      explanation: 'filter는 true를 돌려준 항목을 모아 새 배열을 만든다. 원본은 건드리지 않는다.',
    },
  },
  {
    id: 'js-destructuring',
    chapter: 'C',
    order: 15,
    title: '구조 분해: 꺼내서 이름 붙이기',
    tagline: '{ title, done } = todo',
    kind: 'practice',
    // 고쳐 쓰기만 하는 레슨이라 스타터와 정답의 출력이 같다. "정답과 출력이 같다" 표시를 켜지 않는다.
    outputUnchanged: true,
    definition:
      '구조 분해(destructuring)는 객체나 배열에서 여러 값을 한 줄에 꺼내 이름을 붙이는 문법이다. 객체는 `const { title, done } = todo`처럼 키 이름으로 꺼내고, 배열은 `const [first, second] = list`처럼 순서로 꺼낸다.',
    goal: [
      '`const title = todo.title`과 `const done = todo.done` 두 줄을 `const { title, done } = todo` 한 줄로 바꾼다.',
      'label의 매개변수 자리에서 바로 꺼낸다. `function label(todo)`를 `function label({ title, done })`로 바꾸고, 안의 `todo.`를 전부 뗀다. 부르는 쪽은 그대로 `label(todo)`다. 위에서 이미 title을 만들었는데도 오류가 나지 않는다. 매개변수는 함수를 부를 때마다 함수 안에 새로 생기는 이름이라, 함수 안에서는 바깥의 같은 이름을 가리고 매개변수가 쓰인다.',
      '배열은 순서로 꺼낸다. `const first`와 `const second` 두 줄을 `const [first, second] = pair` 한 줄로 바꾼다.',
    ],
    starterCode: `const todo = { id: 'a', title: '장보기', done: true }

const title = todo.title
const done = todo.done
console.log(title, done)

function label(todo) {
  return todo.done ? todo.title + ' - 끝' : todo.title
}
console.log(label(todo))

const pair = ['장보기', '설거지']
const first = pair[0]
const second = pair[1]
console.log(first, second)
`,
    solutionCode: `const todo = { id: 'a', title: '장보기', done: true }

// 키 이름으로 꺼낸다
const { title, done } = todo
console.log(title, done)

// 매개변수 자리에서 바로 꺼낸다. 리액트 레슨 7에서 이 모양을 다시 만난다
// 매개변수 title·done은 함수 안에 새로 생긴다. 함수 안에서는 위의 title·done을 가리고 이것이 쓰인다
function label({ title, done }) {
  return done ? title + ' - 끝' : title
}
console.log(label(todo))

// 배열은 순서로 꺼낸다. 리액트 레슨 1과 12에서 이 모양을 다시 만난다
const pair = ['장보기', '설거지']
const [first, second] = pair
console.log(first, second)
`,
    deeper: [
      {
        question: 'const [count, setCount] = useState(0)은 무엇을 꺼내나',
        answer:
          'useState는 [지금 값, 값을 바꾸는 함수] 두 칸짜리 배열을 돌려준다. 그것을 순서대로 꺼내 이름을 붙인 것이다. 이름은 우리가 정한다. 배열은 순서로 꺼내므로 [a, b]라고 써도 된다. 이 줄은 레슨 1에서 처음 나오고, 레슨 12에서 제대로 배운다.',
      },
      {
        question: '꺼내면서 이름을 바꾸거나, 없는 키를 꺼내면 어떻게 되나',
        answer: `키 뒤에 콜론을 쓰면 다른 이름으로 받는다. 없는 키를 꺼내면 undefined다.

const { title: name, memo } = todo
console.log(name) // 장보기
console.log(memo) // undefined`,
      },
    ],
    usedIn: [7, 12, 17],
    sources: [
      'https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment',
    ],
    quiz: {
      question: "const [a, b] = ['장보기', '설거지']일 때 b는 무엇인가",
      options: ['장보기', '설거지', 'undefined'],
      answerIndex: 1,
      explanation: '배열은 순서로 꺼낸다. 첫째가 a, 둘째가 b에 들어간다.',
    },
  },
  {
    id: 'js-spread',
    chapter: 'C',
    order: 16,
    title: '스프레드와 얕은 복사',
    tagline: '원본은 두고 새것을 만든다',
    kind: 'practice',
    definition:
      '스프레드(spread, `...`)는 배열이나 객체의 내용을 그 자리에 펼친다. `[...todos, 새 항목]`은 끝에 하나를 더한 새 배열이고, `{ ...todo, done: true }`는 done만 바꾼 새 객체다. 원본은 그대로다. 단, 복사는 맨 바깥 한 겹만 한다. 그 뜻은 아래 "더 파고들면"의 얕은 복사(shallow copy)에서 본다.',
    goal: [
      "push 줄을 지우고 `const added = [...todos, { id: 'c', title: '빨래', done: false }]`로 새 배열을 만든다. 아래 console.log를 `console.log(todos.length, added.length)`로 바꿔, 원본은 2 그대로인지 본다.",
      '둘째 할 일을 끝낸 새 객체를 만든다: `const doneB = { ...todos[1], done: true }`, 그리고 `console.log(todos[1].done, doneB.done)`.',
      "둘을 합친다. id가 'b'인 것만 뒤집은 새 배열: `const toggled = todos.map((todo) => (todo.id === 'b' ? { ...todo, done: !todo.done } : todo))`, 그리고 `console.log(toggled)`. 리액트 레슨 17의 toggle 안에 있는 줄과 같다.",
    ],
    starterCode: `const todos = [
  { id: 'a', title: '장보기', done: true },
  { id: 'b', title: '설거지', done: false },
]

// push는 원본을 고친다. 원본을 두고 새 배열을 만들고 싶다.
todos.push({ id: 'c', title: '빨래', done: false })
console.log(todos.length)
`,
    solutionCode: `const todos = [
  { id: 'a', title: '장보기', done: true },
  { id: 'b', title: '설거지', done: false },
]

// todos의 항목을 펼치고 끝에 하나를 더한 새 배열
const added = [...todos, { id: 'c', title: '빨래', done: false }]
console.log(todos.length, added.length)

// todos[1]의 속성을 펼치고 done만 덮어쓴 새 객체
const doneB = { ...todos[1], done: true }
console.log(todos[1].done, doneB.done)

// 바꿀 항목만 새 객체로, 나머지는 그대로 둔 새 배열
const toggled = todos.map((todo) => (todo.id === 'b' ? { ...todo, done: !todo.done } : todo))
console.log(toggled)
`,
    before: {
      text: '스프레드가 생기기 전에는 배열은 `concat`, 객체는 `Object.assign`으로 복사했다.',
      code: `const added = todos.concat([{ id: 'c', title: '빨래', done: false }])

const doneB = Object.assign({}, todos[1], { done: true })

// 첫 인자 {}를 빠뜨리면 새 객체를 만들지 않고 todos[1] 자체를 고친다
Object.assign(todos[1], { done: true })
`,
    },
    why: [
      'Object.assign은 첫 인자를 고친다. 빈 객체 {}를 맨 앞에 넣는 것을 잊으면, 새 객체를 만든 줄 알았는데 원본이 바뀌어 있었다.',
      '스프레드는 언제나 새 배열·새 객체를 만든다. 원본을 건드릴 길이 없어서, 리액트가 요구하는 "원본은 두고 새 값으로 바꾼다"를 한 줄로 쓸 수 있다.',
    ],
    deeper: [
      {
        question: '얕은 복사란 무엇인가',
        answer: `맨 바깥 한 겹만 새로 만든다는 뜻이다. 새 배열 안에 든 객체는 원본 배열 안의 객체와 같은 것이다. 그래서 복사본 안의 객체를 고치면 원본에서도 바뀌어 보인다. 레슨 16이 이 함정을 다루고, 왜 "같은 것"인지는 JS 18에서 본다.

const copy = [...todos]
copy[0].done = false
console.log(todos[0].done) // false: 안의 객체는 같은 것이다`,
      },
      {
        question: '같은 키가 두 번 나오면 어떻게 되나',
        answer: `뒤에 쓴 것이 이긴다. 그래서 바꿀 속성은 스프레드 뒤에 쓴다.

console.log({ ...todos[1], done: true }) // done: true
console.log({ done: true, ...todos[1] }) // done: false, 원본 값이 덮었다`,
      },
    ],
    usedIn: [16, 17, 22],
    sources: ['https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/Spread_syntax'],
    quiz: {
      question: 'const b = { ...a, done: true }를 실행한 뒤 a.done은 어떻게 되는가',
      options: ['true로 바뀐다', '원래 값 그대로다', 'undefined가 된다'],
      answerIndex: 1,
      explanation: '스프레드는 a의 속성을 새 객체 b에 펼쳐 담는다. a는 건드리지 않는다.',
    },
  },
  {
    id: 'js-json',
    chapter: 'C',
    order: 17,
    title: 'JSON: 객체를 글자로, 글자를 객체로',
    tagline: 'stringify와 parse',
    kind: 'practice',
    definition:
      '`JSON.stringify(값)`은 배열·객체를 글자로 바꾸고, `JSON.parse(글자)`는 그 글자를 다시 배열·객체로 바꾼다. 브라우저 저장소나 서버처럼 글자만 오가는 곳에 데이터를 넣고 꺼낼 때 쓴다. 깨진 글자를 parse하면 오류를 던진다.',
    goal: [
      '`const saved = JSON.stringify(todos)`로 글자로 바꾸고, `console.log(saved)`와 `console.log(typeof saved)`를 찍는다.',
      '`const loaded = JSON.parse(saved)`로 되돌리고, `console.log(loaded[1].title)`을 찍는다.',
      '`console.log(loaded === todos)`를 찍는다. 내용은 같아도 새로 만든 배열이라 false다. 이 차이는 JS 18에서 본다.',
      "깨진 글자를 읽어 본다. `try {` 안에 `JSON.parse('[{')`를 쓰고, `catch (err) {` 안에서 `console.log('읽지 못했다:', err.message)`를 찍는다. 저장된 글자가 깨져도 앱이 멈추지 않게 하는 방법이다(JS 10).",
    ],
    starterCode: `const todos = [
  { id: 'a', title: '장보기', done: true },
  { id: 'b', title: '설거지', done: false },
]

// 브라우저 저장소에는 글자만 넣을 수 있다. 지금 todos는 글자가 아니다.
// 배열은 객체의 한 종류라서 typeof로 물으면 array가 아니라 object가 나온다.
console.log(typeof todos)
`,
    solutionCode: `const todos = [
  { id: 'a', title: '장보기', done: true },
  { id: 'b', title: '설거지', done: false },
]

// 브라우저 저장소에는 글자만 넣을 수 있다. 지금 todos는 글자가 아니다.
// 배열은 객체의 한 종류라서 typeof로 물으면 array가 아니라 object가 나온다.
console.log(typeof todos)

// 배열·객체를 글자로
const saved = JSON.stringify(todos)
console.log(saved)
console.log(typeof saved)

// 글자를 다시 배열·객체로
const loaded = JSON.parse(saved)
console.log(loaded[1].title)
console.log(loaded === todos) // 내용은 같지만 새로 만든 배열이다

// 깨진 글자는 parse가 오류를 던진다
try {
  JSON.parse('[{')
} catch (err) {
  console.log('읽지 못했다:', err.message)
}
`,
    deeper: [
      {
        question: 'JSON 글자에 담지 못하는 값은 무엇인가',
        answer: `함수와 undefined는 빠진다. 글자로 옮길 수 있는 것은 문자열, 숫자, 불리언, null, 그리고 그것들을 담은 배열과 객체뿐이다.

console.log(JSON.stringify({ a: 1, f: () => 1, u: undefined })) // {"a":1}`,
      },
      {
        question: '리액트에서는 어디서 쓰나',
        answer:
          '레슨 27에서 새로고침해도 목록이 남게 할 때 쓴다. 목록이 바뀔 때마다 stringify해서 브라우저 저장소에 넣고, 처음 그릴 때 parse로 꺼낸다. 꺼낸 글자가 깨졌으면 catch로 받아 처음 목록으로 시작한다. 레슨 32에서는 그 일을 커스텀 훅으로 떼어 낸다.',
      },
    ],
    // 챕터 C 스스로 해보기: 할 일 단계 없이 목표 출력만 준다
    challenge: {
      goal: "챕터 C에서 배운 것만으로 쓴다. 아래 todos로 세 줄을 찍는다. 첫째, 끝나지 않은 할 일의 제목만 담은 배열. 둘째, id가 'b'인 할 일을 끝낸 새 목록에서 끝난 할 일의 개수. 셋째, 원본 todos에서 끝난 할 일의 개수. 셋째 줄로 원본이 그대로인지 확인한다.",
      target: "['설거지', '빨래']\n2\n1",
      starterCode: `const todos = [
  { id: 'a', title: '장보기', done: true },
  { id: 'b', title: '설거지', done: false },
  { id: 'c', title: '빨래', done: false },
]

// 여기부터 쓴다
`,
      solutionCode: `const todos = [
  { id: 'a', title: '장보기', done: true },
  { id: 'b', title: '설거지', done: false },
  { id: 'c', title: '빨래', done: false },
]

const left = todos.filter((todo) => !todo.done)
console.log(left.map((todo) => todo.title))

const next = todos.map((todo) => (todo.id === 'b' ? { ...todo, done: true } : todo))
console.log(next.filter((todo) => todo.done).length)

console.log(todos.filter((todo) => todo.done).length)
`,
    },
    usedIn: [27, 32],
    sources: [
      'https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify',
      'https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse',
    ],
    quiz: {
      question: 'typeof JSON.stringify(todos)는 무엇인가',
      options: ['object', 'string', 'array'],
      answerIndex: 1,
      explanation: 'stringify는 배열·객체를 글자로 바꾼다. 그래서 종류는 string이다.',
    },
  },
]
