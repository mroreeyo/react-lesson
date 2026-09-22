// 읽기와 쓰기 모두 실패를 허용한다. 저장이 막힌 브라우저에서도 앱은 그대로 동작하고 기록만 남지 않는다.
// 버전 접미사를 두어 스키마가 바뀌면 이전 키를 무시한다.
export const KEYS = {
  progress: 'reactlab:progress:v1',
  last: 'reactlab:last:v1',
  playground: 'reactlab:playground:v1',
}

export function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return fallback
    return key === KEYS.playground ? raw : JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function save(key, value) {
  try {
    localStorage.setItem(key, key === KEYS.playground ? value : JSON.stringify(value))
  } catch {
    /* 무시 */
  }
}

export function clearProgress() {
  try {
    localStorage.removeItem(KEYS.progress)
    localStorage.removeItem(KEYS.last)
  } catch {
    /* 무시 */
  }
}
