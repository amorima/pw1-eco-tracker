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
      component: LandingPageView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/quick-start',
      name: 'quick-start',
      component: () => import('@/views/QuickStartView.vue'),
      meta: { requiresLogin: true, requiresFirstUse: true },
    },
    {
      path: '/profile-selection',
      name: 'profile-selection',
      component: ProfileSelectionView,
      meta: { requiresLogin: true },
    },
    {
      path: '/home',
      name: 'home',
      component: HomeScreenView,
      meta: { requiresLogin: true },
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
      meta: { requiresLogin: true },
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/AdminDashboardView.vue'),
      meta: { requiresLogin: true, requiresAdmin: true },
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutUsView.vue'),
    },
    {
      path: '/contacts',
      name: 'contacts',
      component: () => import('../views/ContactsView.vue'),
    },
    {
      path: '/privacy',
      name: 'privacy',
      component: () => import('../views/PrivacyPolicyView.vue'),
    },
    {
      path: '/terms',
      name: 'terms',
      component: () => import('../views/TermsOfService.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
    },
  ],
  scrollBehavior() {
    return { left: 0, top: 0 }
  },
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  // Force light mode on routes that use the landing header, but preserve user's selection
  try {
    const lightHeaderRoutes = new Set([
      'landing',
      'about',
      'contacts',
      'privacy',
      'terms',
      'not-found',
      'login',
      'register',
    ])

    const fromIsLight = from && from.name && lightHeaderRoutes.has(from.name)
    const toIsLight = to && to.name && lightHeaderRoutes.has(to.name)

    if (toIsLight) {
      const current = localStorage.getItem('darkMode')
      if (!fromIsLight && current !== null) sessionStorage.setItem('landingPrevDarkMode', current)
      localStorage.setItem('darkMode', 'false')
      if (typeof document !== 'undefined') document.documentElement.classList.remove('dark')
    } else if (fromIsLight && !toIsLight) {
      const saved = sessionStorage.getItem('landingPrevDarkMode')
      if (saved !== null) {
        localStorage.setItem('darkMode', saved)
        if (typeof document !== 'undefined') {
          if (saved === 'true') document.documentElement.classList.add('dark')
          else document.documentElement.classList.remove('dark')
        }
        sessionStorage.removeItem('landingPrevDarkMode')
      }
    }
  } catch {
    // ignore storage errors
  }

  // Check if user needs to login
  if (to.meta.requiresLogin && !userStore.isLoggedIn) {
    next('/login')
    return
  }

  // Check if user needs to complete quick start (first use OR needsQuickStart flag)
  const needsQuickStart =
    userStore.isLoggedIn &&
    (userStore.isFirstUse || userStore.currentUser?.profiles?.[0]?.needsQuickStart)

  if (needsQuickStart && to.name !== 'quick-start') {
    console.log('Router - Redirecting to QuickStart')
    next('/quick-start')
    return
  }

  // Prevent access to quick-start if not needed
  if (to.meta.requiresFirstUse && !needsQuickStart) {
    next('/home')
    return
  }

  // Check admin access
  if (to.meta.requiresAdmin && !userStore.isAdmin && !userStore.isFirstUse) {
    next('/home') // Redirect non-admin users to home
    return
  }

  next()
})

export default router
