import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import ElementPlus from 'unplugin-element-plus/vite'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const isDev = (mode === 'development')
  return {
    server: {
      host: true,
      port: 8089
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    build: {
      outDir: isDev ? 'dist' : 'build',
      emptyOutDir: !isDev,
      rollupOptions: {
        input: [
          fileURLToPath(new URL('./popup.html', import.meta.url)),
          fileURLToPath(new URL('./options.html', import.meta.url)),
          fileURLToPath(new URL('./src/content.ts', import.meta.url)),
          fileURLToPath(new URL('./src/background.ts', import.meta.url))
        ],
        output: {
          entryFileNames: '[name].js',
          sourcemap: isDev
        }
      }
    },
    plugins: [
      ElementPlus(),
      vue(),
      viteStaticCopy({
        targets: [
          {
            src: 'node_modules/webextension-polyfill/dist/browser-polyfill.min.js',
            dest: 'assets'
          }
        ]
      })
    ]
  }
})
