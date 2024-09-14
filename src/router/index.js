import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PlayDominoesComputerView from '../views/PlayDominoesComputerView.vue'
import PlayDominoesOnlineView from '../views/PlayDominoesOnlineView.vue'
import LoginView from '../views/LoginView.vue'
import BaseView from '../views/BaseView.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: BaseView,
      children:[
        {
          path: '/',
          name: 'home',
          component: HomeView
        },
        {
          path: '/login',
          name: 'login',
          component: LoginView
        },
        {
          path: '/play/computer',
          name: 'computer',
          component: PlayDominoesComputerView
        },
        {
          path: '/play/online',
          name: 'online',
          component: PlayDominoesOnlineView
        }
      ]
    }
  ]
})

export default router
