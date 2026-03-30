import { createRouter, createWebHistory } from 'vue-router'
import { useAuth, Maintenance, NotFound, ServerError, Default, demoRoutes } from '@hivespace/shared'

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
    component: ServerError,
    meta: { title: 'Server Error', allowAnonymous: true },
  },
  {
    path: '/maintenance',
    name: 'Maintenance',
    component: Maintenance,
    meta: { title: 'Maintenance', allowAnonymous: true },
  },
  {
    path: '/',
    name: 'Default',
    component: Default,
    props: { redirectPath: '/product/list', showSignUp: true },
    meta: { title: 'HiveSpace - Seller Center', allowAnonymous: true },
  },
  ...demoRoutes.map((route) => {
    // Override the icons route to use local component
    if (route.path === '/demo' && route.children) {
      const children = route.children.map((child) => {
        if (child.path === 'icons') {
          return {
            ...child,
            component: () => import('@/views/Icons.vue'),
          }
        }
        return child
      })

      // If icons route is missing, explicit add it
      if (!children.some((c) => c.path === 'icons')) {
        children.push({
          path: 'icons',
          name: 'Icons',
          component: () => import('@/views/Icons.vue'),
          meta: { title: 'Icons' },
        })
      }

      return {
        ...route,
        component: () => import('@/views/DemoWrapper.vue'),
        children,
      }
    }
    return { ...route, component: () => import('@/views/DemoWrapper.vue') }
  }),
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: { title: 'Not Found', allowAnonymous: true },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(_to, _from, savedPosition) {
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
          meta: { title: 'Product List' },
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
      path: '/orders',
      children: [
        {
          path: '',
          redirect: '/orders/all',
        },
        {
          path: 'all',
          name: 'Order Management',
          component: () => import('@/views/Orders/OrderManagementView.vue'),
          meta: { title: 'Quản lý đơn hàng' },
        },
      ],
    },
    {
      path: '/marketing',
      children: [
        {
          path: '',
          redirect: '/marketing/coupons',
        },
        {
          path: 'coupons',
          name: 'Coupon Management',
          component: () => import('@/views/Marketing/CouponList.vue'),
          meta: { title: 'Coupon Management' },
        },
        {
          path: 'coupons/create',
          name: 'Create Coupon',
          component: () => import('@/views/Marketing/CouponDetail.vue'),
          meta: { title: 'Create Coupon' },
        },
        {
          path: 'coupons/detail/:id',
          name: 'Coupon Detail',
          component: () => import('@/views/Marketing/CouponDetail.vue'),
          meta: { title: 'Coupon Detail' },
        }
      ],
    },
    {
      path: '/register-seller',
      name: 'Register Seller',
      component: () => import('@/views/RegisterStore.vue'),
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

router.beforeEach(async (to, _from, next) => {
  document.title = `${to.meta.title}`
  // Let callback/error routes through without auth checks
  if (to.meta.allowAnonymous) {
    next()
    return
  }
  // For other routes, enforce presence of a local user; if missing, route to '/'
  const { getCurrentUser, login, logout } = useAuth()
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
