import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import './styles/index.scss'

if (import.meta.env.DEV) {
  const iconlakeJS = '/visit/monitor/61c831c3d623b86f0302edc1.js'
  import(/* @vite-ignore */iconlakeJS)
}

createApp(App).use(router).use(i18n).mount('#app')
