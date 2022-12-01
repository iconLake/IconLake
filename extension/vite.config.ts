import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: true,
    port: 8089,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      input: [
        fileURLToPath(new URL('./popup.html', import.meta.url)),
        fileURLToPath(new URL('./options.html', import.meta.url)),
        fileURLToPath(new URL('./src/content.ts', import.meta.url)),
        fileURLToPath(new URL('./src/background.ts', import.meta.url)),
      ],
      output: {
        entryFileNames: '[name].js'
      }
    }
  },
  plugins: [
    vue(),
  ],
})
