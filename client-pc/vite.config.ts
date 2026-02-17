import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
 plugins: [react()],
  server: {
    port: 3002, // 在这里设置你想要的端口号，比如 3001
    strictPort: true, // 如果端口被占用直接报错，而不是自动切换到下一个空闲端口
  }
})
