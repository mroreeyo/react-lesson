# React Lab

리액트 학습용 웹 앱. PRD는 `React Lab PRD — 리액트 학습용 웹 앱.md`.

## 진행 상황

- **M1 완료** — Vite + React 19 골격, 사용자 코드 실행 엔진, 플레이그라운드, Pages 배포
- **M2 진행 중** — 레슨 골격 완료. 남은 것: 챕터 0~2 레슨 본문 17개, 실험실 데모 3종

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

블록 순서는 JS 되짚기 · 한 줄 정의 · 지금 방식 · 없던 시절 · 왜 나왔나 · 더 파고들면 · 확인 문제.
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

localStorage 키는 `src/storage.js`에 셋(`progress` · `last` · `playground`). 읽기·쓰기 실패를 허용한다.
저장이 막힌 브라우저에서도 앱은 그대로 동작하고 기록만 남지 않는다.

## 배포

`main`에 푸시하면 `.github/workflows/deploy.yml`이 Pages로 올린다.
저장소 Settings → Pages → Source를 **GitHub Actions**로 한 번 설정해야 한다.
`vite.config.js`의 `base: './'`이므로 `/<repo>/` 하위 경로에서도 그대로 동작한다.

## 레슨 데이터

`src/lessons/chapter-*.js`에서 레슨 배열을 default export 하면 `src/lessons/index.js`가 자동으로 모은다.
챕터 상수(제목·도입·마무리)는 `index.js`에 있다. 필드는 PRD '데이터 모델' 표를 따르고,
`node src/lessons/lessons.check.mjs`가 그 규칙을 지키는지 본다.

지금은 표본 6개가 들어 있다. 각 블록 경로를 한 번씩 밟는 구성이라 골격 검증용이고, 본문은 다시 쓴다.

| id | order | kind | 확인하는 경로 |
| --- | --- | --- | --- |
| `react-does` | 1 | practice | 전체 블록 + 없던 시절/왜 나왔나/더 파고들면 |
| `js-checklist` | 2 | checklist | 항목별 반복, 챕터 0 마무리 |
| `first-component` | 3 | practice | 필수 블록만 + JS 되짚기, 챕터 1 도입 |
| `import-export` | 4 | concept | 읽기 전용 파일 2개 |
| `lists` | 9 | practice | 7개 블록 전부 + `demo: 'key'` + 출처 |
| `events` | 11 | practice | 챕터 2 진입 |
