# React Lab

리액트 학습용 웹 앱. PRD는 `React Lab PRD — 리액트 학습용 웹 앱.md`.

## 진행 상황

- **M1 완료** — Vite + React 19 골격, 사용자 코드 실행 엔진, 플레이그라운드. 배포는 저장소 권한 대기
- **M2 완료** — 레슨 골격, 챕터 0~2 레슨 17개, 실험실 데모 3종
- **다음 M3** — 챕터 3~4 (레슨 18~32)

```bash
npm install
npm run dev                      # 개발 서버
npm run build                    # dist/ 생성
node src/runner.check.mjs        # 실행 엔진 점검
node src/lessons/lessons.check.mjs # 레슨 데이터 모델 점검
```

## 레슨 골격

| 파일 | 역할 |
| --- | --- |
| `src/App.jsx` | 탭, 전체 진행률, 초기화, 재진입 복원, 모바일 드로어 |
| `src/LessonRail.jsx` | 챕터 6개 접기. 접으면 도입 첫 문장이 한 줄 요약, 챕터별 `n/m` |
| `src/Lesson.jsx` | 본문 블록 렌더. 챕터 도입·마무리, 이전/다음 |
| `src/Quiz.jsx` | 3지선다. 정답이면 완료, 오답은 재시도 |
| `src/CodeSandbox.jsx` | 편집기 + 결과 패널 한 쌍. 레슨과 플레이그라운드가 같이 쓴다 |
| `src/CodeEditor.jsx` · `src/highlight.js` · `src/Code.jsx` | react-simple-code-editor + Prism(jsx). Tab 들여쓰기, Enter 자동 들여쓰기, Esc→Tab으로 나감. 읽기 전용 블록도 같은 색 |
| `src/Labs.jsx` · `src/labs/index.jsx` | 실험실 탭과 데모 3종. 레슨에서 링크로 들어오고 돌아간다 |

블록 순서는 JS 되짚기 · 한 줄 정의 · 지금 방식 · 없던 시절 · 왜 나왔나 · 더 파고들면 · 확인 문제.
확인 문제를 맞히면 그 자리에 "다음 레슨" 버튼이 나온다.
뒤의 세 블록은 있는 레슨에만 나온다. `kind`가 `practice`면 편집기, `concept`면 읽기 전용 코드,
`checklist`면 항목별 반복이다. 레슨을 넘길 때 편집기는 `key`로 갈려 초기 코드로 돌아간다.

## 실행 엔진

`src/runner.js` — `@babel/standalone`을 지연 로드해 `Babel.transform(code, { presets: ['react'] })`으로
JSX를 변환하고, `new Function`에 앱이 쓰는 React 객체와 훅을 주입해 `App`을 돌려받는다.
훅 목록은 React 네임스페이스에서 뽑으므로 19의 `use`·`useActionState`·`useOptimistic`도 함께 들어온다.

`src/ResultPanel.jsx` — 결과는 앱 트리와 분리된 전용 root에 렌더한다. 오류 경계로 감싸고,
코드가 바뀌면 `runKey`를 갈아 오류 상태를 초기화한다. `use`를 위해 기본으로 Suspense를 감싼다.

오류는 세 갈래로 화면에 표시된다: 문법 오류(변환 실패), 실행 오류(`App` 미정의·최상위 예외),
렌더 중 오류(오류 경계). 오류가 나면 직전 정상 화면은 지운다.

localStorage 키는 `src/storage.js`에 넷(`progress` · `last` · `playground` · `drafts`). 읽기·쓰기 실패를 허용한다.
`drafts`는 레슨별 편집 초안이다. 초기 코드는 레슨마다 고정이고 앞 레슨의 수정을 물려받지 않지만,
그 레슨에서 고친 것은 남는다. "원래 코드로"를 누르면 초안이 지워진다.
저장이 막힌 브라우저에서도 앱은 그대로 동작하고 기록만 남지 않는다.

## 배포

`main`에 푸시하면 `.github/workflows/deploy.yml`이 Pages로 올린다.
저장소 Settings → Pages → Source를 **GitHub Actions**로 한 번 설정해야 한다.
`vite.config.js`의 `base: './'`이므로 `/<repo>/` 하위 경로에서도 그대로 동작한다.

## 레슨 데이터

`src/lessons/chapter-*.js`에서 레슨 배열을 default export 하면 `src/lessons/index.js`가 자동으로 모은다.
챕터 상수(제목·도입·마무리)는 `index.js`에 있다. 필드는 PRD '데이터 모델' 표를 따르고,
`node src/lessons/lessons.check.mjs`가 그 규칙을 지키는지 본다.

챕터 0~5의 레슨 39개가 들어 있다. 챕터별 최종 코드를 먼저 확정하고 레슨을 역산해 썼다.

실습 레슨은 `starterCode`(앞 레슨 방식으로 돌아가는 상태)와 `solutionCode`(이 레슨의 완성본)를 둘 다 가진다.
`goal`은 무엇을 어디에 치는지 적은 할 일 문장이다. 학습자가 직접 친다. 채점은 하지 않는다 —
맞았는지는 결과 화면과 접힌 "정답 코드 보기"를 견주어 스스로 본다. 레슨 1만 완성본으로 시작한다.
틀린 코드 레슨(19·21·28·31)은 스타터가 곧 고쳐야 할 코드이고 solutionCode가 고친 것이다.
챕터 1 끝(레슨 10)은 배열에서 그려지는 정적 목록, 챕터 2 끝(레슨 17)은 그 목록이 state가 되어
토글과 추가가 되는 상태다. 각 레슨의 `starterCode`는 그 시점까지 자란 앱이다.

'없던 시절'·'왜 나왔나'가 붙은 레슨은 PRD 배경 표의 개념이 있는 여섯 개뿐이다 —
1(리액트 자체), 3(함수 컴포넌트), 5(JSX), 9(key), 12(훅), 17(불변 업데이트).
데모로 이어지는 레슨은 9(key)와 13(리렌더링 전파)이다.
