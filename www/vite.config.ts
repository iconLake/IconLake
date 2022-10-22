import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const proxyDomain = 'http://127.0.0.1:8088'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/manage/',
  plugins: [vue()],
  server: {
    host: '127.0.0.1',
    port: 8080,
    strictPort: true,
    proxy: {
      '/api': proxyDomain,
      '/visit': proxyDomain,
      '/login': proxyDomain,
      '/common': proxyDomain,
      '/imgs': proxyDomain,
      '/avatar': proxyDomain,
    }
  },
  build: {
    outDir: '../service/public/manage',
    emptyOutDir: true
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
