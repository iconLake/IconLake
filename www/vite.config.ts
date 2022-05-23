import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/manage/',
  plugins: [vue()],
  server: {
    host: '127.0.0.1',
    port: 8080,
    strictPort: true,
    proxy: {
      '/api': 'http://127.0.0.1:8088',
      '/visit': 'http://127.0.0.1:8088',
      '/login': 'http://127.0.0.1:8088',
      '/common': 'http://127.0.0.1:8088',
      '/imgs': 'http://127.0.0.1:8088',
    }
  },
  build: {
    outDir: '../service/public/manage',
    emptyOutDir: true
  }
})
