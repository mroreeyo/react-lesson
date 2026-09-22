// 챕터별 모듈을 자동으로 모은다. 레슨을 추가할 때 이 파일은 건드리지 않고
// src/lessons/chapter-N.js 에서 lessons 배열만 default export 하면 된다.
const modules = import.meta.glob('./chapter-*.js', { eager: true })

export const lessons = Object.values(modules)
  .flatMap((m) => m.default ?? [])
  .sort((a, b) => a.order - b.order)

// 챕터 상수. 도입 문단의 첫 문장이 목록 접힌 상태의 한 줄 요약으로 쓰인다.
export const chapters = [
  {
    id: '0',
    title: '시작하기 전에',
    intro:
      '리액트를 쓰기 전에 두 가지를 확인한다. 리액트가 대신해 주는 일이 무엇이고, 앞으로 쓸 JS 문법이 손에 익었는지다.\n\n이 챕터를 지나면 "왜 굳이 리액트인가"에 한 문장으로 답할 수 있다.',
    outro:
      '리액트가 무엇을 대신해 주는지 봤다. 다음 챕터에서는 화면에 무엇을 어떻게 그리는지, 할 일 카드 한 장부터 시작한다.',
  },
  {
    id: '1',
    title: 'UI 표현하기',
    intro:
      '화면을 함수로 만든다. 할 일 카드 한 장을 그리고, 제목과 완료 여부를 props로 받아, 목록으로 늘린다.\n\n이 챕터가 끝나면 데이터를 화면으로 바꿀 수 있다.',
    outro:
      '할 일 목록이 화면에 나왔다. 그런데 체크박스를 눌러도 아무 일도 일어나지 않는다. 화면은 데이터를 보여줄 뿐, 데이터가 바뀌는 방법을 아직 모르기 때문이다.',
  },
  {
    id: '2',
    title: '상호작용 더하기',
    intro:
      '지금까지 할 일 목록을 화면에 그렸다. 그런데 체크박스를 눌러도 아무 일도 일어나지 않는다.\n\n이번 챕터에서는 리액트가 변화를 어떻게 다루는지 본다.',
    outro:
      '화면이 움직이기 시작했다. 다음 챕터에서는 늘어난 상태를 어디에 두어야 하는지 정리한다.',
  },
  { id: '3', title: 'state 관리하기', intro: '', outro: '' },
  { id: '4', title: '탈출구', intro: '', outro: '' },
  { id: '5', title: '성능과 최신 React', intro: '', outro: '' },
]

export const chapterOf = (id) => chapters.find((c) => c.id === id)
export const lessonsOf = (chapterId) => lessons.filter((l) => l.chapter === chapterId)
export const lessonIndex = (id) => lessons.findIndex((l) => l.id === id)
