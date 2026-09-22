import * as React from 'react'

// @babel/standalone은 용량이 크므로 별도 청크로 지연 로드한다.
// 편집기가 처음 보일 때 loadBabel()을 불러 미리 받기 시작한다.
let babelPromise = null
export function loadBabel() {
  if (!babelPromise) babelPromise = import('@babel/standalone')
  return babelPromise
}

// 사용자 코드에 import가 없어도 되도록, 앱이 쓰는 React 객체와 훅을 인자로 주입한다.
// 훅 목록을 직접 적지 않고 React 네임스페이스에서 뽑으므로 19의 use/useActionState/useOptimistic도 함께 들어온다.
const injections = {
  React,
  Fragment: React.Fragment,
  Suspense: React.Suspense,
  ...Object.fromEntries(
    Object.entries(React).filter(([k, v]) => k.startsWith('use') && typeof v === 'function'),
  ),
}
const injectionNames = Object.keys(injections)

export const injectedHookNames = injectionNames.filter((n) => n.startsWith('use')).sort()

export class CodeError extends Error {
  constructor(stage, message) {
    super(message)
    this.stage = stage // 'compile' | 'run'
  }
}

/**
 * 사용자 코드를 변환·실행해 App 컴포넌트를 돌려준다.
 * 실패하면 stage가 붙은 CodeError를 던진다. 렌더 중 예외는 여기서 잡히지 않고 결과 패널의 오류 경계가 받는다.
 */
export async function compileToApp(code) {
  const Babel = await loadBabel()

  let compiled
  try {
    compiled = Babel.transform(code, {
      presets: ['react'],
      filename: 'playground.jsx',
    }).code
  } catch (err) {
    throw new CodeError('compile', err.message)
  }

  let App
  try {
    const run = new Function(
      ...injectionNames,
      `"use strict";\n${compiled}\n;return typeof App !== 'undefined' ? App : undefined;`,
    )
    App = run(...injectionNames.map((n) => injections[n]))
  } catch (err) {
    throw new CodeError('run', err.message)
  }

  if (typeof App !== 'function') {
    throw new CodeError('run', 'App 컴포넌트를 찾지 못했습니다. `function App() { ... }` 을 정의하세요.')
  }
  return App
}
