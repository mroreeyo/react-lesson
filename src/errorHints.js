// 사용자 코드 오류를 "무엇이 잘못됐고 무엇을 고치면 되는지"로 바꾼다.
// 원문은 그대로 아래에 보여주므로 여기서는 첫 줄만 만든다. 사과하지 않는다.
const HINTS = [
  // ── 변환(문법) 단계
  [
    /expected "jsxTagEnd"|Unterminated JSX contents|Expected corresponding JSX closing tag/,
    '태그가 닫히지 않았다. 여는 태그마다 닫는 태그가 있는지, `<input />`처럼 스스로 닫는지 확인한다.',
  ],
  [
    /Adjacent JSX elements must be wrapped/,
    '나란한 태그 둘을 돌려주고 있다. 태그 하나로 감싸거나 `<>...</>`로 묶는다.',
  ],
  [/Unterminated string constant/, '따옴표가 닫히지 않았다. 표시된 줄의 따옴표 짝을 확인한다.'],
  [/Unterminated template/, '백틱(`)이 닫히지 않았다.'],
  [
    /Unexpected token/,
    '문법이 어긋난 자리다. 표시된 줄 근처의 괄호·중괄호 짝과 쉼표를 확인한다.',
  ],
  [/Missing semicolon|Unexpected reserved word/, '표시된 줄 앞뒤의 문장이 끝나지 않았거나 예약어를 이름으로 썼다.'],

  // ── 실행·렌더 단계
  // 배포 빌드의 React는 메시지 대신 번호만 준다 ("Minified React error #31"). 번호로 먼저 잡는다.
  [/Minified React error #31\b/, '객체를 화면에 그리려 했다. 중괄호 안에는 문자열·숫자·JSX만 넣는다. 객체면 속성을 꺼내 쓴다.'],
  [/Minified React error #130\b/, '컴포넌트 자리에 undefined가 왔다. `<X />`의 X가 정의됐는지, 이름의 대소문자가 맞는지 확인한다.'],
  [/Minified React error #185\b/, 'state를 바꾸면 다시 그리고, 다시 그리면 또 바꿔서 끝나지 않는다. Effect의 의존성 배열과 setXxx 위치를 확인한다.'],
  [/Minified React error #301\b/, '렌더 중에 state를 바꾸고 있다. `setXxx(...)` 호출을 이벤트 핸들러나 Effect 안으로 옮긴다. `onClick={fn()}`처럼 괄호를 붙여 호출하고 있지 않은지도 본다.'],
  [/Minified React error #3(?:00|10)\b/, '훅을 부르는 순서가 렌더마다 달라졌다. 훅을 if·반복문·return 뒤에 두지 않는다.'],
  [/Minified React error #321\b/, '컴포넌트 함수 밖에서 훅을 불렀다. 훅은 컴포넌트나 `use`로 시작하는 커스텀 훅 안, 맨 위에서만 부른다.'],
  [
    /(\w+) is not defined/,
    (m) => `\`${m[1]}\`이(가) 정의되지 않았다. 철자를 확인하거나 위에서 먼저 선언한다. import는 쓸 수 없다.`,
  ],
  [
    /Cannot access '(\w+)' before initialization/,
    (m) => `\`${m[1]}\`을(를) 선언하기 전에 썼다. 선언을 위로 올린다.`,
  ],
  [/is not a function/, '함수가 아닌 것을 호출했다. 이름이 맞는지, 그 값이 함수인지 확인한다.'],
  [
    /Cannot read propert(?:y|ies) of (?:undefined|null)/,
    '비어 있는 값에서 속성을 읽었다. 그 값이 먼저 채워지는지 확인한다. ref라면 렌더 중에 읽고 있지 않은지 본다.',
  ],
  [
    /Objects are not valid as a React child/,
    '객체를 화면에 그리려 했다. 중괄호 안에는 문자열·숫자·JSX만 넣는다. 객체면 속성을 꺼내 쓴다.',
  ],
  [
    /Too many re-renders/,
    '렌더 중에 state를 바꾸고 있다. `setXxx(...)` 호출을 이벤트 핸들러나 Effect 안으로 옮긴다. `onClick={fn()}`처럼 괄호를 붙여 호출하고 있지 않은지도 본다.',
  ],
  [
    /Maximum update depth exceeded/,
    'state를 바꾸면 다시 그리고, 다시 그리면 또 바꿔서 끝나지 않는다. Effect의 의존성 배열과 setXxx 위치를 확인한다.',
  ],
  [
    /Rendered more hooks|Rendered fewer hooks|change in the order of Hooks/,
    '훅을 부르는 순서가 렌더마다 달라졌다. 훅을 if·반복문·return 뒤에 두지 않는다.',
  ],
  [
    /Invalid hook call/,
    '컴포넌트 함수 밖에서 훅을 불렀다. 훅은 컴포넌트나 `use`로 시작하는 커스텀 훅 안, 맨 위에서만 부른다.',
  ],
  [
    /suspended while responding to synchronous input/,
    'use()로 기다리는 컴포넌트 위에 Suspense가 없다. `<Suspense fallback={...}>`로 감싼다.',
  ],
]

/** 오류 원문을 받아 한국어 첫 줄을 돌려준다. 아는 패턴이 없으면 null. */
export function hintFor(message) {
  if (!message) return null
  for (const [re, hint] of HINTS) {
    const m = re.exec(message)
    if (m) return typeof hint === 'function' ? hint(m) : hint
  }
  return null
}
