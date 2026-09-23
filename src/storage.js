// 읽기와 쓰기 모두 실패를 허용한다. 저장이 막힌 브라우저에서도 앱은 그대로 동작하고 기록만 남지 않는다.
// 버전 접미사를 두어 스키마가 바뀌면 이전 키를 무시한다.
export const KEYS = {
  progress: 'reactlab:progress:v1',
  last: 'reactlab:last:v1',
  playground: 'reactlab:playground:v1',
  // 레슨별 편집 초안 { [lessonId]: code }. 초기 코드와 같아지면 지운다.
  drafts: 'reactlab:drafts:v1',
}

export function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return fallback
    if (key === KEYS.playground) return raw
    const value = JSON.parse(raw)
    // 저장소는 신뢰 경계다. 모양이 기대와 다르면(null, 문자열, 배열 대신 객체) 버리고 기본값을 쓴다.
    const sameShape =
      value !== null &&
      typeof value === typeof fallback &&
      Array.isArray(value) === Array.isArray(fallback)
    return sameShape ? value : fallback
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
