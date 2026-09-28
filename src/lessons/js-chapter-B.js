// JS 기초 챕터 B. 흐름과 함수. 끝났는지에 따라 다른 문장을 고르고, 그 일을 함수로 묶는다.
export default [
  {
    id: 'js-if-switch',
    chapter: 'B',
    order: 6,
    title: '조건문: if와 switch',
    tagline: '값에 따라 갈래를 고른다',
    kind: 'practice',
    definition:
      '`if (조건) { ... }`는 조건이 true일 때만 중괄호 안을 실행한다. 이어 붙인 `else { ... }`는 아닐 때 실행할 곳이다. `switch (값)`은 값이 어느 `case`와 같은지에 따라 여러 갈래 중 하나를 고른다.',
    goal: [
      "'끝' 줄 위에 `if (done) {`를 쓴다. '끝' 줄과 '아직' 줄 사이에 `} else {`를, '아직' 줄 아래에 `}`를 쓴다. done이 false이므로 '아직' 줄만 찍힌다.",
      '맨 위의 `const done = false`를 true로 바꿔 다른 줄이 찍히는지 보고, 다시 false로 돌린다.',
      "아래에 `const filter = 'left'`를 만들고, 그 아래 줄에 `switch (filter) {`를 쓴다.",
      "`case 'all':`을 쓰고, 그 아래에 `console.log('전부 보여준다')`와 `break`를 한 줄씩 쓴다. 같은 모양으로 `case 'left':`(남은 것만 보여준다)와 `case 'done':`(끝낸 것만 보여준다)도 쓴다.",
      "마지막에 `default:`를 쓰고 그 아래에 `console.log('모르는 필터: ' + filter)`를 쓴 뒤, `}`로 switch를 닫는다. '남은 것만 보여준다'가 찍힌다.",
    ],
    starterCode: `const title = '장보기'
const done = false

// done에 따라 한 줄만 찍고 싶다. 지금은 둘 다 찍힌다.
console.log(title + ' · 끝')
console.log(title + ' · 아직')
`,
    solutionCode: `const title = '장보기'
const done = false

if (done) {
  console.log(title + ' · 끝') // done이 true일 때만
} else {
  console.log(title + ' · 아직') // 아닐 때
}

const filter = 'left'

switch (filter) {
  case 'all':
    console.log('전부 보여준다')
    break // 여기서 switch를 나간다
  case 'left':
    console.log('남은 것만 보여준다')
    break
  case 'done':
    console.log('끝낸 것만 보여준다')
    break
  default:
    console.log('모르는 필터: ' + filter) // 어느 case와도 같지 않을 때
}
`,
    deeper: [
      {
        question: 'break를 빼면 어떻게 되나',
        answer:
          "같은 case에서 멈추지 않고 아래 case의 줄까지 이어서 실행한다. 'left' 뒤의 break를 지우고 실행해 보면 두 줄이 찍힌다. 레슨 22의 reducer는 case마다 return으로 함수를 끝내므로 break가 필요 없다. return은 JS 8에서 배운다.",
      },
      {
        question: 'if의 조건 자리에 true·false가 아닌 값을 넣으면',
        answer:
          "거짓처럼 취급되는 값이 정해져 있다. false, 0, 빈 글자 '', null, undefined다. 나머지는 전부 참처럼 취급된다. 그래서 if (title)은 title이 빈 글자가 아닐 때 실행된다. 이 규칙이 레슨 8에서 개수 0이 화면에 찍히는 함정의 뿌리다. JS 7에서 본다.",
      },
      {
        question: 'if (done = true)는 왜 언제나 실행되나',
        answer: `=는 비교가 아니라 넣기다. done에 true를 넣고, 그 결과인 true로 조건을 본다. 그래서 늘 참이다. 같은지 물을 때는 ===를 쓴다(JS 4). done이 const면 넣을 수 없어 오류가 나고, let이면 오류 없이 조용히 틀린다.

let done = false
if (done = true) console.log('늘 찍힌다')   // 넣기
if (done === true) console.log('같을 때만') // 비교`,
      },
    ],
    usedIn: [17, 22, 28],
    sources: [
      'https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Statements/if...else',
      'https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Statements/switch',
    ],
    quiz: {
      question: 'done이 false일 때 if (done) { A } else { B }는 무엇을 실행하는가',
      options: ['A만', 'B만', 'A와 B 둘 다'],
      answerIndex: 1,
      explanation: '조건이 true가 아니므로 if의 중괄호는 건너뛰고 else의 중괄호를 실행한다.',
    },
  },
  {
    id: 'js-ternary-and',
    chapter: 'B',
    order: 7,
    title: '표현식과 문: 삼항 연산자와 &&',
    tagline: '값이 되는 조건',
    kind: 'practice',
    definition:
      '표현식은 값이 되는 코드다. `조건 ? A : B`는 조건이 true면 A, 아니면 B가 되는 표현식이고, `조건 && A`는 조건이 true일 때 A가 된다. if는 값이 되지 않는 문이라서 값을 넣을 자리에 쓸 수 없다.',
    goal: [
      "`let label`부터 if/else 끝까지를 지우고 한 줄로 쓴다: `const label = done ? title + ' · 끝' : title + ' · 아직'`. 찍히는 것은 같다.",
      "`const left = 0`을 만들고 `console.log(left === 0 ? '다 끝났다' : '남은 것 ' + left + '개')`를 찍는다. left를 2로 바꿔 보고 0으로 돌린다.",
      "`console.log(done && '끝났다')`와 `console.log(!done && '아직이다')`를 찍어 &&가 무엇이 되는지 본다.",
    ],
    starterCode: `const title = '장보기'
const done = false

// 문장 하나를 고르는 데 여섯 줄을 쓴다.
let label
if (done) {
  label = title + ' · 끝'
} else {
  label = title + ' · 아직'
}
console.log(label)
`,
    solutionCode: `const title = '장보기'
const done = false

// 조건 ? true일 때의 값 : false일 때의 값
const label = done ? title + ' · 끝' : title + ' · 아직'
console.log(label)

const left = 0
console.log(left === 0 ? '다 끝났다' : '남은 것 ' + left + '개')

// 조건 && 값: 조건이 true면 값이 되고, 아니면 조건 그대로(false)가 된다
console.log(done && '끝났다')
console.log(!done && '아직이다')
`,
    deeper: [
      {
        question: '리액트는 왜 if 대신 삼항과 &&를 쓰나',
        answer:
          'JSX의 중괄호 안은 값을 넣는 자리다. if는 값이 되지 않으므로 그 자리에 넣을 수 없고, 값이 되는 삼항과 &&를 쓴다. 레슨 6과 레슨 8이 이 이야기다.',
      },
      {
        question: '0 && 무엇은 왜 0인가',
        answer: `&&는 앞이 거짓처럼 취급되는 값이면 그 값을 그대로 돌려준다. false는 화면에 그려지지 않지만 0은 그려진다. 그래서 개수 && ... 는 개수가 0일 때 화면에 0을 남긴다. 레슨 8에서 이 함정을 피한다.

console.log(0 && '있다')     // 0
console.log(0 > 0 && '있다') // false`,
      },
    ],
    usedIn: [6, 8, 17],
    sources: [
      'https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/Conditional_operator',
      'https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/Logical_AND',
    ],
    quiz: {
      question: "done이 false일 때 done ? '끝' : '아직'은 무엇이 되는가",
      options: ['끝', '아직', 'false'],
      answerIndex: 1,
      explanation: "조건이 false이므로 콜론(:) 뒤의 값 '아직'이 된다.",
    },
  },
  {
    id: 'js-functions',
    chapter: 'B',
    order: 8,
    title: '함수: 만들고, 부르고, 돌려받기',
    tagline: '되풀이하는 일을 이름 하나로',
    kind: 'practice',
    definition:
      '함수는 이름 붙인 코드 묶음이다. `function 이름(매개변수) { ... }`로 만들고 `이름(인자)`로 부른다. 이것을 호출이라 한다. 부를 때 넘긴 값(인자)이 매개변수 이름으로 들어가고, `return 값`은 그 값을 부른 자리로 돌려주며 함수를 거기서 끝낸다.',
    goal: [
      "맨 위에 함수를 만든다. `function label(title, done) {`를 쓰고, 다음 줄에 `return done ? title + ' · 끝' : title + ' · 아직'`, 그 다음 줄에 `}`를 쓴다.",
      '두 console.log 안의 삼항을 `label(title1, done1)`과 `label(title2, done2)`로 바꾼다. 찍히는 것은 같다.',
      "`console.log(label('빨래', false))`로 이름 없이 값을 바로 넘겨 본다.",
      "빈 제목을 막는다. 함수의 첫 줄에 `if (title.trim() === '') return '(제목 없음)'`을 넣고, 아래에서 `console.log(label('  ', false))`를 찍는다. 실행할 줄이 하나면 if의 중괄호를 생략해도 된다.",
    ],
    starterCode: `// 할 일마다 같은 삼항을 되풀이하고 있다.
const title1 = '장보기'
const done1 = true
console.log(done1 ? title1 + ' · 끝' : title1 + ' · 아직')

const title2 = '설거지'
const done2 = false
console.log(done2 ? title2 + ' · 끝' : title2 + ' · 아직')
`,
    solutionCode: `// 제목과 끝났는지를 받아(매개변수) 한 줄 문장을 돌려준다(return)
function label(title, done) {
  if (title.trim() === '') return '(제목 없음)' // return을 만나면 여기서 끝난다
  return done ? title + ' · 끝' : title + ' · 아직'
}

const title1 = '장보기'
const done1 = true
console.log(label(title1, done1)) // 부르기: 인자 두 개를 넘긴다

const title2 = '설거지'
const done2 = false
console.log(label(title2, done2))

console.log(label('빨래', false))
console.log(label('  ', false))
`,
    deeper: [
      {
        question: 'return이 없는 함수를 부르면 무엇이 돌아오나',
        answer: `undefined가 돌아온다. 안의 console.log는 실행되지만, 부른 자리에 돌려주는 값은 없다.

function hello() {
  console.log('안녕')
}
const result = hello() // 안녕이 찍힌다
console.log(result)    // undefined`,
      },
      {
        question: '리액트 컴포넌트도 이런 함수인가',
        answer:
          '그렇다. 컴포넌트는 props를 받아 화면을 돌려주는 함수다(레슨 3). 레슨 17의 add 함수는 이 레슨에서 넣은 것과 같은 모양의 줄로 시작한다. 입력이 비었으면 return으로 거기서 끝내고 아무것도 더하지 않는다.',
      },
    ],
    usedIn: [3, 17, 22],
    sources: ['https://developer.mozilla.org/ko/docs/Web/JavaScript/Guide/Functions'],
    quiz: {
      question: 'function double(n) { return n + n }일 때 console.log(double(3))은 무엇을 찍는가',
      options: ['3', '6', 'undefined'],
      answerIndex: 1,
      explanation: '인자 3이 매개변수 n으로 들어가고, n + n인 6이 부른 자리로 돌아온다.',
    },
  },
  {
    id: 'js-arrow-functions',
    chapter: 'B',
    order: 9,
    title: '화살표 함수와 "함수는 값이다"',
    tagline: '함수를 담고, 넘긴다',
    kind: 'practice',
    definition:
      '함수도 값이라서 변수에 담고, 다른 함수에 인자로 넘길 수 있다. `(매개변수) => 값`은 함수를 짧게 쓰는 화살표 함수다. 화살표 뒤가 중괄호 없이 값 하나면 return을 쓰지 않아도 그 값을 돌려준다.',
    goal: [
      "같은 함수를 화살표로 만든다: `const label2 = (title, done) => (done ? title + ' · 끝' : title + ' · 아직')`. 그리고 `console.log(label2('설거지', false))`로 결과가 같은지 본다.",
      '함수를 부르지 않고 찍어 본다: `console.log(label)`. 괄호를 붙이지 않으면 부르지 않고, 함수 자체가 값으로 쓰인다. 이 콘솔은 함수 label로 적고, 브라우저 개발자 도구는 ƒ label(title, done)처럼 적는다.',
      "함수를 받는 함수를 만든다. `function twice(fn) {`를 쓰고, 그 안에 `fn()`을 두 줄 쓰고, `}`로 닫는다. 그리고 `twice(() => console.log('불렸다'))`를 부른다. 넘긴 함수를 twice가 두 번 부른다.",
    ],
    starterCode: `function label(title, done) {
  return done ? title + ' · 끝' : title + ' · 아직'
}

console.log(label('장보기', true))
`,
    solutionCode: `function label(title, done) {
  return done ? title + ' · 끝' : title + ' · 아직'
}

console.log(label('장보기', true))

// 같은 함수를 화살표로. 화살표 뒤가 값 하나면 그 값을 돌려준다
const label2 = (title, done) => (done ? title + ' · 끝' : title + ' · 아직')
console.log(label2('설거지', false))

// 괄호 없이 쓰면 부르지 않는다. 함수 자체가 값이다
console.log(label)

// 함수를 받아 두 번 부르는 함수
function twice(fn) {
  fn()
  fn()
}
twice(() => console.log('불렸다'))
`,
    before: {
      text: '화살표 함수가 생기기 전(2015년 이전)에는 함수를 값으로 넘길 때도 `function` 키워드와 return을 다 썼다.',
      code: `twice(function () {
  console.log('불렸다')
})

const label2 = function (title, done) {
  return done ? title + ' · 끝' : title + ' · 아직'
}
`,
    },
    why: [
      '짧은 함수 하나를 넘기는 데도 function, 중괄호, return이 붙어 여러 줄이 됐다. 함수를 넘기는 일이 많은 코드에서는 무엇을 하는지보다 틀이 먼저 보였다.',
      '화살표 함수는 값 하나를 돌려주는 함수를 한 줄로 쓰게 한다. 리액트 코드의 `onClick={() => ...}`와 `todos.map((todo) => ...)`가 전부 화살표 함수다.',
    ],
    deeper: [
      {
        question: 'onClick={add}와 onClick={add()}는 어떻게 다른가',
        answer:
          '앞은 함수를 값으로 넘긴다. 버튼을 누를 때 리액트가 그 함수를 부른다. 뒤는 화면을 그리는 지금 당장 add를 부르고, 그 결과(돌려주는 것이 없으면 undefined)를 넘긴다. 이 레슨의 console.log(label)과 label(...)의 차이와 같다. 레슨 11에서 본다.',
      },
      {
        question: '화살표 뒤에 중괄호를 쓰면',
        answer: `중괄호 안에는 여러 줄을 쓸 수 있지만, 그때는 return을 직접 써야 한다. 빠뜨리면 undefined를 돌려준다.

const a = (n) => n + 1            // 값 하나: 그 값을 돌려준다
const b = (n) => { n + 1 }        // 중괄호인데 return이 없다: undefined
const c = (n) => { return n + 1 } // a와 같다`,
      },
    ],
    usedIn: [11, 14, 17],
    sources: ['https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Functions/Arrow_functions'],
    quiz: {
      question: "function hi() { return '안녕' }일 때 console.log(hi)와 console.log(hi())는 어떻게 다른가",
      options: [
        '둘 다 안녕을 찍는다',
        'hi는 함수 자체를, hi()는 부른 결과인 안녕을 찍는다',
        'hi는 오류가 난다',
      ],
      answerIndex: 1,
      explanation: '괄호를 붙여야 부른다. 괄호가 없으면 함수라는 값 그 자체다.',
    },
  },
  {
    id: 'js-try-catch',
    chapter: 'B',
    order: 10,
    title: '오류 다루기: throw와 try/catch',
    tagline: '멈추게 하고, 받아 낸다',
    kind: 'practice',
    definition:
      "`throw new Error('메시지')`는 오류를 던져 그 자리에서 실행을 멈춘다. `try { ... } catch (err) { ... }`는 try 안에서 던진 오류를 받아 catch로 넘긴다. 받은 err 뒤에 `.message`를 붙이면(문자열의 `.length`처럼) 던질 때 쓴 메시지를 꺼낸다.",
    goal: [
      "`return '(제목 없음)'`을 `throw new Error('제목이 비었다')`로 바꾼다. 실행 오류가 나고, 오류가 난 줄 다음은 실행되지 않는다.",
      "두 console.log를 `try {`와 `}` 사이로 옮긴다. 바로 뒤에 `catch (err) {`를 열고 `console.log('못 만들었다:', err.message)`를 쓴 뒤 `}`로 닫는다. 오류 상자 대신 콘솔에 한 줄이 찍힌다.",
      "맨 아래에 `console.log('try 밖은 계속 실행된다')`를 찍는다. catch가 오류를 받았으므로 코드는 끝까지 간다.",
    ],
    starterCode: `function label(title, done) {
  if (title.trim() === '') return '(제목 없음)'
  return done ? title + ' · 끝' : title + ' · 아직'
}

console.log(label('장보기', true))
console.log(label('  ', false))
`,
    solutionCode: `function label(title, done) {
  if (title.trim() === '') throw new Error('제목이 비었다') // 던지면 여기서 멈춘다
  return done ? title + ' · 끝' : title + ' · 아직'
}

try {
  console.log(label('장보기', true))
  console.log(label('  ', false)) // 여기서 던진다. try의 나머지는 건너뛴다
} catch (err) {
  // 던진 오류가 err로 들어온다
  console.log('못 만들었다:', err.message)
}

console.log('try 밖은 계속 실행된다')
`,
    deeper: [
      {
        question: '리액트에서는 어디서 쓰나',
        answer:
          '레슨 22의 reducer는 모르는 action을 받으면 throw한다. 조용히 넘어가면 오타를 못 찾기 때문이다. 레슨 27은 브라우저 저장소에서 읽은 글자가 깨졌을 때 나는 오류를 catch로 받아, 앱이 멈추지 않고 처음 목록으로 시작하게 한다. 그 글자를 읽는 법은 JS 17에서 배운다.',
      },
      {
        question: 'catch 뒤의 (err)는 꼭 써야 하나',
        answer: `받은 오류를 쓰지 않으면 괄호째 생략할 수 있다. 레슨 27이 이렇게 쓴다. 무엇이 틀렸는지는 상관없이 처음 목록으로 돌아가면 되기 때문이다.

try {
  JSON.parse(raw)
} catch {
  // 오류를 쓰지 않으므로 (err)가 없다
}`,
      },
      {
        question: 'throw를 쓰지 않았는데 나는 오류도 catch로 받나',
        answer: `받는다. 없는 값에서 속성을 꺼내는 것처럼 JS가 스스로 던지는 오류도 같다.

try {
  const todo = undefined
  console.log(todo.title)
} catch (err) {
  console.log(err.message) // Cannot read properties of undefined ...
}`,
      },
    ],
    usedIn: [22, 27, 35],
    sources: [
      'https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Statements/throw',
      'https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Statements/try...catch',
    ],
    quiz: {
      question: 'try 안의 세 줄 중 둘째 줄에서 오류가 던져졌다. 셋째 줄은 어떻게 되는가',
      options: ['그대로 실행된다', '건너뛰고 catch로 간다', '앱 전체가 멈춘다'],
      answerIndex: 1,
      explanation: '던진 자리에서 try를 빠져나와 catch로 간다. catch가 받았으므로 try/catch 뒤의 코드는 계속 실행된다.',
    },
  },
]
