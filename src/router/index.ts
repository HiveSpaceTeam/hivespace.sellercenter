import { createRouter, createWebHistory } from 'vue-router'
import demoRoutes from './demoRoutes'
import { getCurrentUser, login, logout } from '@/auth/user-manager'

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
    path: '/verify-email-callback',
    name: 'Verify Email Callback',
    component: () => import('@/views/Callback/VerifyEmailCallback.vue'),
    meta: { title: 'Verify Email', allowAnonymous: true },
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
    meta: { title: 'HiveSpace - Seller Center', allowAnonymous: true },
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
      path: '/product',
      children: [
        {
          path: '',
          redirect: '/product/list',
        },
        {
          path: 'list',
          name: 'List product',
          component: () => import('@/views/Products/ProductList.vue'),
          meta: { title: 'User management' },
        },
        {
          path: 'new',
          name: 'New Product',
          component: () => import('@/views/Products/UpsertProduct.vue'),
          meta: { title: 'Add product' },
        },
        {
          path: ':id',
          name: 'Edit Product',
          component: () => import('@/views/Products/UpsertProduct.vue'),
          meta: { title: 'Edit product' },
        },
      ],
    },
    {
      path: '/register-seller',
      name: 'Register Seller',
      component: () => import('@/views/RegisterSeller.vue'),
      meta: { title: 'Register Seller' },
    },
    {
      path: '/verify-email',
      name: 'Verify Email',
      component: () => import('@/views/VerifyEmail.vue'),
      meta: { title: 'Verify Email' },
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

  // For other routes, enforce presence of a local user; if missing, route to '/'
  const user = await getCurrentUser()
  if (!user) {
    await login()
    return
  }

  if (user.isAdmin() || user.isSystemAdmin()) {
    await logout()
    next(false)
    return
  }

  // Check if user is not a seller
  if (!user.isSeller()) {
    // Priority 1: If not seller and email is not verified, redirect to verify-email
    if (!user.profile.email_verified && !to.path.startsWith('/verify-email')) {
      next('/verify-email')
      return
    }

    // Priority 2: If not seller and email is verified, redirect to register-seller
    if (user.profile.email_verified && !to.path.startsWith('/register-seller')) {
      next('/register-seller')
      return
    }
  }

  // If all conditions are met (user is a seller or on correct route), allow navigation
  next()
})
