import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PlayDominosComputerView from '../views/PlayDominosComputerView.vue'
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
          component: PlayDominosComputerView
        },
      ]
    }
  ]
})

export default router
