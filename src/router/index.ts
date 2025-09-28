import { createRouter, createWebHistory } from 'vue-router'
import demoRoutes from './demoRoutes'
import { getCurrentUser } from '@/auth/user-manager'

// Single grouped collection for several related routes (callbacks, error pages,
// maintenance, default and 404). We keep the same order and meta fields so
// runtime behavior is unchanged. This makes the router easier to scan.
const mainRoutes = [
  // Determine post logout redirect path from config (use only the path portion)
  {
    path: '/callback/logout',
    name: 'LogoutCallback',
    component: () => import('@/views/Callback/LogoutCallback.vue'),
    meta: { allowAnonymous: true },
  },
  {
    path: '/callback/login',
    name: 'Callback',
    component: () => import('@/views/Callback/LoginCallback.vue'),
    meta: { allowAnonymous: true },
  },
  {
    path: '/server-error',
    name: 'ServerError',
    component: () => import('@/views/Pages/ServerError.vue'),
    meta: { title: 'Server Error', allowAnonymous: true },
  },
  {
    path: '/maintenance',
    name: 'Maintenance',
    component: () => import('@/views/Pages/Maintenance.vue'),
    meta: { title: 'Maintenance', allowAnonymous: true },
  },
  {
    path: '/',
    name: 'Default',
    component: () => import('@/views/Default.vue'),
    meta: { title: 'HiveSpace - Seller Center' },
  },
  ...demoRoutes,
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/Pages/NotFound.vue'),
    meta: { title: 'Not Found', allowAnonymous: true },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  },
  routes: [
    {
      path: '/account',
      children: [
        {
          path: '',
          redirect: '/account/user-management',
        },
        {
          path: 'user-management',
          name: 'User management',
          component: () => import('@/views/Accounts/UserManagement.vue'),
          meta: { title: 'User management' },
        },
        {
          path: 'admin-management',
          name: 'Admin management',
          component: () => import('@/views/Accounts/AdminManagement.vue'),
          meta: { title: 'Admin management' },
        },
      ],
    },
    // Grouped block (callbacks, pages, default, demo, notFound)
    ...mainRoutes,
  ],
})

export default router

router.beforeEach(async (to, from, next) => {
  document.title = `${to.meta.title}`

  // Let callback/error routes through without auth checks
  if (to.meta.allowAnonymous) {
    next()
    return
  }

  // If visiting root and a local user exists, send them to user management.
  if (to.path === '/') {
    next()
    return
  }

  // For other routes, enforce presence of a local user; if missing, route to '/'
  const user = await getCurrentUser()
  if (!user) {
    next('/')
    return
  }

  next()
})
