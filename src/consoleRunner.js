import { loadBabel } from './runner.js'

// JS 기초 트랙의 실행 엔진. App 대신 코드 전체를 위에서 아래로 돌리고, console 출력을 줄로 모은다.
const MAX_LINES = 500
const IDENT = /^[A-Za-z_$][\w$]*$/

/**
 * 콘솔에 적을 모양으로 값을 바꾼다. 개발자 도구에 맞춰 맨 바깥 문자열만 따옴표 없이 쓴다.
 * 그래야 배열 안의 5와 '5'가 다르게 보인다. 짧으면 한 줄, 길면 들여쓴 여러 줄이다.
 */
export function formatValue(value, nested = false, seen = new Set(), indent = '') {
  if (typeof value === 'string') return nested ? `'${value}'` : value
  if (typeof value === 'function') return value.name ? `함수 ${value.name}` : '함수'
  if (value === null || typeof value !== 'object') return String(value)
  if (value instanceof Error) return `${value.name}: ${value.message}`
  if (seen.has(value)) return '[순환]'

  seen.add(value)
  const inner = indent + '  '
  const isArray = Array.isArray(value)
  const parts = isArray
    ? value.map((v) => formatValue(v, true, seen, inner))
    : Object.keys(value).map(
        (k) => `${IDENT.test(k) ? k : `'${k}'`}: ${formatValue(value[k], true, seen, inner)}`,
      )
  // 같은 객체를 두 번 넣은 것은 순환이 아니다. 지금 펼치는 경로에서만 본다.
  seen.delete(value)

  const proto = Object.getPrototypeOf(value)
  const prefix = isArray || proto === Object.prototype || proto === null ? '' : `${value.constructor?.name ?? ''} `
  const [open, close] = isArray ? ['[', ']'] : ['{', '}']
  if (parts.length === 0) return `${prefix}${open}${close}`
  const oneLine = isArray ? `${open}${parts.join(', ')}${close}` : `${open} ${parts.join(', ')} ${close}`
  if (oneLine.length <= 60 && !oneLine.includes('\n')) return prefix + oneLine
  return `${prefix}${open}\n${parts.map((p) => inner + p).join(',\n')}\n${indent}${close}`
}

/**
 * 코드를 변환·실행하고 console 출력을 onLine({ level, text, late })으로 한 줄씩 넘긴다.
 * 던지지 않는다. 오류는 { error: { stage, message } }로 돌려주고, 오류 전에 찍힌 줄은 그대로 남는다.
 * dispose()는 이 실행이 걸어 둔 타이머를 전부 멈춘다. 다시 실행하기 전에 반드시 부른다.
 */
export async function runConsole(code, onLine) {
  const Babel = await loadBabel()

  let compiled
  try {
    // 프리셋 없이 문법만 확인한다. JSX는 여기서 문법 오류가 된다.
    compiled = Babel.transform(code, { filename: 'console.js' }).code
  } catch (err) {
    // 학습자는 console.js라는 파일을 본 적이 없다. 파일 이름 머리는 떼고 줄:칸만 남긴다.
    const message = err.message.replace(/^\/console\.js: /, '')
    return { error: { stage: 'compile', message }, dispose: () => {} }
  }

  let count = 0
  let late = false // 코드가 끝까지 돈 뒤(타이머·Promise)에 온 줄
  let disposed = false
  const emit = (level, args) => {
    if (disposed || count > MAX_LINES) return
    if (++count > MAX_LINES) {
      onLine({ level: 'warn', text: '출력이 너무 많아 멈췄다. 반복이 끝나는지 확인한다.', late })
      return
    }
    onLine({ level, text: args.map((a) => formatValue(a)).join(' '), late })
  }
  const fakeConsole = {
    log: (...a) => emit('log', a),
    info: (...a) => emit('log', a),
    warn: (...a) => emit('warn', a),
    error: (...a) => emit('error', a),
  }

  // 타이머를 실행마다 새로 주입해 이 실행의 것만 모은다. 편집할 때 옛 타이머가 남아 출력이 뒤섞이지 않게 한다.
  const timeouts = new Set()
  const intervals = new Set()
  // 타이머 안에서 던진 오류는 창까지 가지 않게 여기서 받아 오류 줄로 적는다.
  const guarded =
    (fn) =>
    (...args) => {
      try {
        fn(...args)
      } catch (err) {
        emit('error', [err])
      }
    }
  const timerApi = {
    setTimeout: (fn, ms, ...args) => {
      const id = setTimeout(() => {
        timeouts.delete(id)
        guarded(fn)(...args)
      }, ms)
      timeouts.add(id)
      return id
    },
    setInterval: (fn, ms, ...args) => {
      const id = setInterval(() => guarded(fn)(...args), ms)
      intervals.add(id)
      return id
    },
    clearTimeout: (id) => {
      timeouts.delete(id)
      clearTimeout(id)
    },
    clearInterval: (id) => {
      intervals.delete(id)
      clearInterval(id)
    },
  }

  // 잡히지 않은 Promise 오류도 콘솔의 오류 줄로 쌓는다.
  const onReject = (e) => {
    e.preventDefault()
    emit('error', [e.reason])
  }
  const hasWindow = typeof window !== 'undefined'
  if (hasWindow) window.addEventListener('unhandledrejection', onReject)

  const dispose = () => {
    disposed = true
    timeouts.forEach((id) => clearTimeout(id))
    intervals.forEach((id) => clearInterval(id))
    if (hasWindow) window.removeEventListener('unhandledrejection', onReject)
  }

  let error = null
  try {
    const names = ['console', ...Object.keys(timerApi)]
    new Function(...names, `"use strict";\n${compiled}`)(fakeConsole, ...Object.values(timerApi))
  } catch (err) {
    error = { stage: 'run', message: err?.message ?? String(err) }
  }
  // 동기 코드는 여기서 끝났다. Promise 콜백은 이 뒤에 돌므로 '나중'으로 표시된다.
  late = true
  return { error, dispose }
}
