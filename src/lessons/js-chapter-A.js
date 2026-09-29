// JS 기초 챕터 A. 값과 변수. 할 일 하나를 값으로 적는다.
// 결과는 화면이 아니라 콘솔 출력이다. 스타터는 앞 레슨의 상태, 정답은 이 레슨의 완성본이다.
export default [
  {
    id: 'js-console-log',
    chapter: 'A',
    order: 1,
    title: '코드를 실행하고 결과 보기',
    tagline: '치고, 실행하고, 콘솔을 본다',
    kind: 'practice',
    definition:
      '`console.log(...)`는 괄호 안에 넣은 것을 콘솔에 한 줄로 적는다. 코드는 위에서 아래로 한 줄씩 실행되고, 콘솔은 그 결과를 눈으로 확인하는 창이다.',
    goal: [
      "`console.log('할 일: 장보기')` 아래 줄에 `console.log('할 일: 설거지')`를 친다. 잠시 뒤 콘솔에 두 줄이 친 순서대로 찍힌다.",
      "그 아래에 `console.log('할 일: 빨래')`를 치고, 그 줄 맨 앞에 `//`를 붙인다. 그 줄은 주석이 되어 찍히지 않는다.",
    ],
    starterCode: `// 빗금 두 개(//) 뒤는 주석이다. 실행되지 않는다. 사람이 읽으라고 남기는 메모다.
console.log('할 일: 장보기')
`,
    solutionCode: `// 빗금 두 개(//) 뒤는 주석이다. 실행되지 않는다. 사람이 읽으라고 남기는 메모다.
console.log('할 일: 장보기')
console.log('할 일: 설거지')
// console.log('할 일: 빨래')
`,
    deeper: [
      {
        question: '이 콘솔과 브라우저 개발자 도구의 콘솔은 같은가',
        answer:
          '같은 console.log다. 브라우저에서 F12를 누르면 나오는 개발자 도구에도 콘솔이 있고, 실제 웹 페이지의 코드가 찍은 줄은 그쪽에 나온다. 출력을 적는 모양(글자에 따옴표를 언제 붙이는지 등)은 개발자 도구에 맞췄다.\n\n다른 점은 둘이다. 개발자 도구는 여러 개를 묶은 것(JS 11·12에서 배운다)을 눌러 펼쳐 보게 하고, 이 앱은 처음부터 펼쳐 적는다. 또 이 앱은 코드가 끝난 뒤에 도착한 줄 앞에 "나중"을 붙인다. JS 21에서 이 표시를 쓴다.',
      },
      {
        question: '작은따옴표와 큰따옴표는 다른가',
        answer:
          "같다. '장보기'와 \"장보기\"는 같은 글자다. 이 앱의 코드는 작은따옴표로 통일했다.",
      },
    ],
    usedIn: [3, 11],
    sources: ['https://developer.mozilla.org/ko/docs/Web/API/console/log_static'],
    quiz: {
      question: 'console.log를 세 줄 쓰고, 가운데 줄 맨 앞에 //를 붙여 실행했다. 콘솔에는 무엇이 찍히는가',
      options: [
        '세 줄 모두 찍힌다',
        '첫째 줄과 셋째 줄이 그 순서대로 찍힌다',
        '아무것도 찍히지 않는다',
      ],
      answerIndex: 1,
      explanation: '// 뒤는 주석이라 실행되지 않는다. 나머지 두 줄은 위에서 아래로 친 순서대로 찍힌다.',
    },
  },
  {
    id: 'js-values',
    chapter: 'A',
    order: 2,
    title: '값의 종류',
    tagline: '3과 \'3\'은 다르다',
    kind: 'practice',
    definition:
      '값은 코드가 다루는 데이터 한 조각이다. 글자는 문자열, 수는 숫자, 참·거짓은 불리언이고, 비어 있음을 뜻하는 undefined와 null이 있다. `typeof 값`은 그 값의 종류 이름을 글자로 돌려준다. 돌려준다는 것은 그 자리가 결과로 바뀐다는 뜻이다. `console.log(typeof 3)`은 `console.log(\'number\')`와 같다.',
    goal: [
      "콘솔에서 3과 '3'이 똑같이 3으로 보인다. 아래에 `console.log(typeof 3)`과 `console.log(typeof '3')`을 쳐서 둘의 종류를 확인한다.",
      "끝났는지를 뜻하는 `console.log(false)`와 `console.log(typeof false)`를 친다.",
      "아직 정하지 않은 값 `console.log(undefined)`와 일부러 비워 둔 값 `console.log(null)`을 친다.",
      "`console.log([3, '3'])`을 친다. 대괄호로 묶으면 글자에 따옴표가 붙어 둘이 구별된다. 대괄호 묶음은 JS 11에서 배운다.",
    ],
    starterCode: `console.log('할 일: 장보기')

// 할 일 하나를 여러 값으로 적는다.
console.log('장보기') // 문자열: 따옴표로 감싼 글자
console.log(3)        // 숫자: 남은 할 일 개수
console.log('3')      // 따옴표로 감쌌으니 이것도 문자열이다
`,
    solutionCode: `console.log('할 일: 장보기')

// 할 일 하나를 여러 값으로 적는다.
console.log('장보기') // 문자열: 따옴표로 감싼 글자
console.log(3)        // 숫자: 남은 할 일 개수
console.log('3')      // 따옴표로 감쌌으니 이것도 문자열이다

console.log(typeof 3)   // number
console.log(typeof '3') // string

console.log(false)         // 불리언: 끝났나? 아니다
console.log(typeof false)  // boolean

console.log(undefined) // 아직 정하지 않았다
console.log(null)      // 일부러 비워 뒀다

console.log([3, '3'])  // 묶음 안에서는 글자에 따옴표가 붙는다
`,
    deeper: [
      {
        question: "typeof null은 왜 'object'인가",
        answer:
          "쳐 보면 object가 나온다. JS 초창기의 실수인데, 고치면 그 동작에 기대던 옛 웹사이트가 깨지므로 그대로 남았다. 어떤 값이 null인지 알고 싶으면 typeof 대신 `값 === null`로 묻는다. === 는 JS 4에서 배운다.",
      },
      {
        question: 'undefined와 null은 어떻게 다른가',
        answer:
          'undefined는 JS가 "아직 정해지지 않았다"고 채워 넣는 값이고, null은 사람이 "일부러 비워 뒀다"고 적는 값이다. 리액트 레슨 26에서는 아직 연결되지 않은 입력칸 자리를 null로 비워 둔다.',
      },
    ],
    usedIn: [1, 6, 8],
    sources: [
      'https://developer.mozilla.org/ko/docs/Web/JavaScript/Data_structures',
      'https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/typeof',
    ],
    quiz: {
      question: "console.log(typeof '3')은 무엇을 찍는가",
      options: ['number', 'string', '3'],
      answerIndex: 1,
      explanation: "따옴표로 감싼 값은 안에 숫자가 있어도 문자열이다. typeof는 그 종류 이름 string을 돌려준다.",
    },
  },
  {
    id: 'js-const-let',
    chapter: 'A',
    order: 3,
    title: '변수: const와 let',
    tagline: '값에 이름을 붙인다',
    kind: 'practice',
    definition:
      '변수는 값에 붙이는 이름이다. `const 이름 = 값`으로 만든 이름에는 다른 값을 다시 넣을 수 없고, `let 이름 = 값`으로 만든 이름에는 나중에 `이름 = 새 값`으로 다른 값을 넣을 수 있다.',
    goal: [
      "맨 위에 `const title = '장보기'`와 `let done = false`를 만든다.",
      "아래 console.log 안의 '장보기'를 title로, false를 done으로 바꾼다. 콘솔 출력은 바꾸기 전과 같아야 한다.",
      "맨 아래에 `done = true`를 치고 `console.log('끝났나:', done)`을 한 번 더 찍는다.",
      "`title = '설거지'`를 쳐 본다. const라서 오류가 난다. 확인했으면 그 줄을 지운다.",
    ],
    starterCode: `// 괄호 안에 쉼표로 여러 값을 넣으면 한 줄에 공백으로 이어 찍는다.
// 같은 글자를 두 번 적었다. 할 일 이름이 바뀌면 두 줄을 다 고쳐야 한다.
console.log('할 일:', '장보기')
console.log('끝났나:', false)
console.log('다시 확인:', '장보기', false)
`,
    solutionCode: `const title = '장보기' // 바꿔 넣지 않을 값
let done = false       // 나중에 바꿔 넣을 값

// 괄호 안에 쉼표로 여러 값을 넣으면 한 줄에 공백으로 이어 찍는다.
console.log('할 일:', title)
console.log('끝났나:', done)
console.log('다시 확인:', title, done)

done = true // let이라 다른 값을 넣을 수 있다
console.log('끝났나:', done)
`,
    before: {
      text: 'const와 let이 생기기 전(2015년 이전)에는 변수를 전부 `var`로 만들었다. 지금도 오래된 코드와 검색 결과에서 자주 마주친다.',
      code: `var title = '장보기'

// ... 이 사이에 코드가 수백 줄 있다 ...

var title = '설거지' // 같은 이름을 또 만들어도 아무 말이 없다

console.log(title) // 설거지 — 위의 '장보기'가 조용히 덮였다
`,
    },
    why: [
      'var는 같은 이름을 다시 만들어도 조용했다. 코드가 길어지면 어느 줄이 값을 덮었는지 찾을 수 없었다.',
      'const와 let은 같은 이름을 두 번 만들면 바로 오류를 낸다. 그리고 const는 "이 이름에는 다른 값이 들어오지 않는다"를 코드에 적어 두는 셈이라, 읽는 사람이 값이 바뀌는 곳을 찾아다니지 않아도 된다.',
    ],
    deeper: [
      {
        question: '언제 const를 쓰고 언제 let을 쓰나',
        answer:
          '기본은 const다. 다른 값을 다시 넣을 일이 분명할 때만 let을 쓴다. 리액트 레슨의 코드는 거의 전부 const다. 바뀌는 값인 state조차 const로 받는다. 값을 바꾸는 일은 이름에 다시 넣는 대신 리액트가 주는 함수에 맡기기 때문이다. 레슨 12에서 본다.',
      },
      {
        question: 'const로 만든 목록에 항목을 더할 수 있나',
        answer:
          '더할 수 있다. const가 막는 것은 이름에 다른 값을 다시 넣는 일이지, 그 값의 안을 고치는 일이 아니다. 이 차이가 리액트에서 가장 많이 막히는 자리 중 하나다. JS 18에서 본다.',
      },
    ],
    usedIn: [1, 7, 12],
    sources: [
      'https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Statements/const',
      'https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Statements/let',
    ],
    quiz: {
      question: "const title = '장보기' 아래에 title = '설거지'를 치면 어떻게 되는가",
      options: [
        'title에 설거지가 들어간다',
        '오류가 난다. const로 만든 이름에는 다른 값을 넣을 수 없다',
        '장보기와 설거지가 둘 다 남는다',
      ],
      answerIndex: 1,
      explanation: '다른 값을 넣을 이름이면 let으로 만든다. const는 처음 넣은 값에 묶인다.',
    },
  },
  {
    id: 'js-operators',
    chapter: 'A',
    order: 4,
    title: '연산자: 더하고, 견주고, 뒤집기',
    tagline: '+, ++, ===, !==, !',
    kind: 'practice',
    definition:
      '연산자는 값을 받아 새 값을 만드는 기호다. `+`는 수를 더하거나 글자를 이어 붙이고, `===`와 `!==`는 같은지·다른지 물어 true나 false를 돌려주고, `!`는 true와 false를 뒤집는다.',
    goal: [
      "맨 아래에, 할 일 하나를 더했다고 치고 `count = count + 1`을 친 뒤 `console.log('남은 개수:', count)`로 3을 확인한다.",
      "`count++`로 한 번 더 늘리고 같은 줄로 4를 찍는다.",
      "`console.log(title + '!')`로 글자를 이어 붙인다.",
      "`console.log(count === 4)`와 `console.log(title !== '설거지')`로 같은지·다른지 묻는다.",
      "`console.log(!done)`으로 참·거짓을 뒤집는다.",
    ],
    starterCode: `const title = '장보기'
let count = 2
let done = false

console.log('할 일:', title)
console.log('남은 개수:', count)
console.log('끝났나:', done)
`,
    solutionCode: `const title = '장보기'
let count = 2
let done = false

console.log('할 일:', title)
console.log('남은 개수:', count)
console.log('끝났나:', done)

count = count + 1 // 오른쪽을 먼저 계산해 왼쪽 이름에 넣는다
console.log('남은 개수:', count)

count++ // count = count + 1 을 줄여 쓴 것
console.log('남은 개수:', count)

console.log(title + '!')        // 글자끼리 +는 이어 붙이기
console.log(count === 4)        // 같은가
console.log(title !== '설거지') // 다른가
console.log(!done)              // 뒤집기
`,
    deeper: [
      {
        question: '== 와 === 는 어떻게 다른가',
        answer:
          "==는 종류가 달라도 맞춰 본 뒤 비교한다. 3 == '3'은 true이고 3 === '3'은 false다. 맞추는 규칙이 복잡해 뜻밖의 결과가 나오므로, 이 앱과 리액트 문서의 코드는 ===와 !==만 쓴다.",
      },
      {
        question: "'3' + 1은 무엇인가",
        answer:
          "'31'이다. 한쪽이라도 글자면 +는 더하지 않고 이어 붙인다. 입력칸에서 받은 값은 숫자처럼 보여도 글자이므로, 더하기 전에 Number('3')처럼 숫자로 바꾼다.",
      },
      {
        question: 'count += 2는 무엇인가',
        answer:
          'count = count + 2를 줄여 쓴 것이다. ++가 1만 더한다면 +=는 오른쪽의 값만큼 더한다. 레슨 33에서 그린 횟수를 셀 때 이렇게 쓴다.',
      },
    ],
    usedIn: [8, 10, 17],
    sources: [
      'https://developer.mozilla.org/ko/docs/Web/JavaScript/Guide/Expressions_and_operators',
      'https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/Strict_equality',
    ],
    quiz: {
      question: "count가 2일 때 count === '2'는 무엇인가",
      options: ['true', 'false', '오류가 난다'],
      answerIndex: 1,
      explanation: "===는 종류까지 같아야 true다. 2는 숫자, '2'는 문자열이다.",
    },
  },
  {
    id: 'js-strings',
    chapter: 'A',
    order: 5,
    title: '문자열 다루기',
    tagline: 'length, trim, includes',
    kind: 'practice',
    definition:
      '문자열 뒤에 점(.)을 찍으면 그 문자열에 딸린 것을 꺼낸다. `length`처럼 괄호 없이 읽는 것은 속성, `trim()`처럼 괄호를 붙여 부르는 것은 메서드다. `trim()`은 앞뒤 공백을 뗀 새 문자열을, `includes(글자)`는 그 글자가 들어 있는지를 돌려준다.',
    goal: [
      "`console.log(input.length)`로 글자 수를 찍는다. 공백까지 세어 7이 나온다.",
      "`const title = input.trim()`으로 앞뒤 공백을 뗀 글자를 만들고, `console.log('[' + title + ']')`와 `console.log(title === '장보기')`를 찍는다.",
      "`console.log(title.includes('장'))`으로 '장'이 들어 있는지 묻는다.",
      "공백만 친 입력 `const blank = '   '`을 만들고 `console.log(blank.trim() === '')`를 찍는다. 빈 할 일을 막을 때 리액트 레슨이 쓰는 비교다.",
    ],
    starterCode: `// 사용자가 입력칸에 친 글자라고 치자. 앞뒤에 공백이 섞여 들어왔다.
const input = '  장보기  '

console.log('[' + input + ']') // 대괄호로 감싸 공백이 보이게 한다
console.log(input === '장보기')
`,
    solutionCode: `// 사용자가 입력칸에 친 글자라고 치자. 앞뒤에 공백이 섞여 들어왔다.
const input = '  장보기  '

console.log('[' + input + ']') // 대괄호로 감싸 공백이 보이게 한다
console.log(input === '장보기')

console.log(input.length) // 속성: 괄호 없이 읽는다

const title = input.trim() // 메서드: 괄호를 붙여 부른다
console.log('[' + title + ']')
console.log(title === '장보기')
console.log(title.includes('장'))

// 공백만 친 입력은 공백을 떼고 나면 빈 글자('')가 된다
const blank = '   '
console.log(blank.trim() === '')
`,
    deeper: [
      {
        question: 'trim()을 부르면 input도 바뀌나',
        answer:
          '안 바뀐다. trim()은 공백을 뗀 새 문자열을 돌려줄 뿐이다. 그래서 결과를 쓰려면 const title = input.trim()처럼 받아 둔다. 문자열의 메서드는 전부 이렇게 원본을 두고 새 값을 돌려준다. 배열에는 원본을 고치는 메서드가 섞여 있어 JS 14에서 따로 본다.',
      },
      {
        question: '빈 입력을 막는 줄은 리액트에서 어떻게 생겼나',
        answer:
          '레슨 17의 추가 버튼은 이 줄로 시작한다. 입력이 공백뿐이면 거기서 멈추고 아무것도 더하지 않는다. if와 return은 JS 6과 JS 8에서 배운다.\n\n// 입력이 공백뿐이면 여기서 멈춘다\nif (draft.trim() === \'\') return',
      },
    ],
    usedIn: [17, 18, 35],
    sources: [
      'https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/String/trim',
      'https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/String/includes',
    ],
    quiz: {
      question: "input이 '  장보기  '일 때 input.trim().length는 무엇인가",
      options: ['7', '3', '5'],
      answerIndex: 1,
      explanation: "trim()이 앞뒤 공백을 뗀 '장보기'를 돌려주고, 그 글자 수는 3이다.",
    },
  },
]
