import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // 상대 경로 base. GitHub Pages의 /<repo>/ 하위 경로에서도 그대로 동작한다.
  base: './',
  plugins: [react()],
  // babel-standalone 청크는 원래 크다. 지연 로드하므로 경고만 끈다.
  build: { chunkSizeWarningLimit: 3500 },
})
