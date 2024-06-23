import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PlayDominosComputerView from '../views/PlayDominosComputerView.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/play/computer',
      name: 'computer',
      component: PlayDominosComputerView
    },
  ]
})

export default router
