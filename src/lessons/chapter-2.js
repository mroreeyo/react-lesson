export default [
  {
    id: 'events',
    chapter: '2',
    order: 11,
    title: '이벤트에 응답하기',
    tagline: '클릭에 함수를 건넨다',
    kind: 'practice',
    definition:
      'onClick 같은 prop에 함수를 건네면 리액트가 그 일이 생겼을 때 불러 준다. 호출한 결과가 아니라 함수 자체를 건넨다.',
    goal: '체크박스와 버튼이 눌린다.',
    starterCode: `function App() {
  function handleAdd() {
    alert('추가!')
  }

  return (
    <div>
      <ul>
        <li>
          <input type="checkbox" onChange={() => console.log('토글')} />
          <span>장보기</span>
        </li>
      </ul>
      <button onClick={handleAdd}>추가</button>
    </div>
  )
}
`,
    quiz: {
      question: '`onClick={handleAdd()}`는 무엇이 다른가',
      options: [
        '똑같이 동작한다',
        '그릴 때 바로 호출되고, 그 반환값이 onClick에 들어간다',
        '클릭할 때마다 두 번 호출된다',
      ],
      answerIndex: 1,
      explanation:
        '괄호를 붙이면 그 자리에서 호출한다. 리액트에 넘어가는 것은 함수가 아니라 호출 결과다. 함수 자체를 건네야 한다.',
    },
  },
]
