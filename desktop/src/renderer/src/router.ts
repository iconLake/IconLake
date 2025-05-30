import { createWebHistory, createRouter } from 'vue-router'
import Settings from './pages/Settings.vue'

const routes = [
  { path: '/settings', component: Settings },
]

export const router = createRouter({
  history: createWebHistory('/desktop'),
  routes,
})
