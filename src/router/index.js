import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '../supabase'
import HomeView from '../views/HomeView.vue'
import PlayDominoesComputerView from '../views/PlayDominoesComputerView.vue'
import PlayDominoesOnlineView from '../views/PlayDominoesOnlineView.vue'
import PlayDominoesOnlineGameView from '../views/PlayDominoesOnlineGameView.vue'
import LoginView from '../views/LoginView.vue'
import SignupView from '../views/SignupView.vue'
import BaseView from '../views/BaseView.vue'
import ProfileView from '../views/ProfileView.vue'
import LeaderboardView from '../views/LeaderboardView.vue'
import CallbackView from '../views/CallbackView.vue'
import SetUsernameView from '../views/SetUsernameView.vue'

const isAuthenticated = async () => {
  const { data, error } = await supabase.auth.getUser();
  return data.user ? true : false; // Return true if user exists, false otherwise
};
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: BaseView,
      children: [
        {
          path: '/',
          name: 'home',
          component: HomeView
        },
        {
          path: '/leaderboard',
          name: 'leaderboard',
          component: LeaderboardView
        },
        {
          path: '/profile',
          name: 'profile',
          component: ProfileView,
          meta: { requiresAuth: true }
        },
        {
          path: '/play/computer',
          name: 'computer',
          component: PlayDominoesComputerView
        },
        {
          path: '/play/online',
          name: 'online',
          component: PlayDominoesOnlineView,
          meta: { requiresAuth: true }
        },
        {
          path: '/play/online/:id',
          name: 'online-game',
          component: PlayDominoesOnlineGameView,
          meta: { requiresAuth: true }
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignupView
    },
    {
      path: '/callback',
      name: 'callback',
      component: CallbackView
    }, 
    {
      path: '/set-username',
      name: 'set-username',
      component: SetUsernameView
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      next('/login'); // Redirect to login if not authenticated
    } else {
      next(); // Allow access
    }
  } else {
    next(); // Proceed as normal
  }
});
export default router
