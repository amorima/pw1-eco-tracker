import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

import LandingPageView from '@/views/LandingPageView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import ProfileSelectionView from '@/views/ProfileSelectionView.vue'
import HomeScreenView from '@/views/HomeScreenView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: LandingPageView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/profile-selection',
      name: 'profile-selection',
      component: ProfileSelectionView,
      meta: { requiresLogin: true }
    },
    {
      path: '/home',
      name: 'home',
      component: HomeScreenView,
      meta: { requiresLogin: true }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
      meta: { requiresLogin: true }
    },
   /*  {
      path: '/activities',
      name: 'activities',
      component: () => import('../views/ActivitiesView.vue'),
      meta: { requiresLogin: true }
    },
    {
      path: '/appliances',
      name: 'appliances',
      component: () => import('../views/ApliancesView.vue'),
      meta: { requiresLogin: true }
    },
    {
      path: '/statistics',
      name: 'statistics',
      component: () => import('../views/StatisticsView.vue'),
      meta: { requiresLogin: true }
    }, */
    {
      path: '/leaderboard',
      name: 'leaderboard',
      component: () => import('../views/LeaderboardView.vue'),
      meta: { requiresLogin: true }
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/AdminDashboardView.vue'),
      meta: { requiresLogin: true, requiresAdmin: true }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutUsView.vue')
    },
    {
      path: '/contacts',
      name: 'contacts',
      component: () => import('../views/ContactsView.vue')
    },
    {
      path: '/privacy',
      name: 'privacy',
      component: () => import('../views/PrivacyPolicyView.vue')
    },
    {
      path: '/terms',
      name: 'terms',
      component: () => import('../views/TermsOfService.vue')
    }
  ],
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  if (to.meta.requiresLogin && !userStore.userIsLoggedIn) {
    next('/login')
    return
  }
  
  if (to.meta.requiresAdmin && !userStore.userIsAdmin) {
    next('/home') // Redirect non-admin users to home
    return
  }
  
  next()
})

export default router
