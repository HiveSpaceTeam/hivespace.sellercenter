import userManager, { login } from '@/auth/user-manager'
import { createRouter, createWebHistory } from 'vue-router'
import demoRoutes from './demoRoutes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  },
  routes: [
    {
      path: '/callback',
      name: 'Callback',
      component: () => import('@/views/Callback.vue'),
    },
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
          component: () => import('@/views/Products/AddProduct.vue'),
          meta: { title: 'Admin management' },
        },
        {
          path: ':id',
          name: 'Edit Product',
          component: () => import('@/views/Products/AddProduct.vue'),
          meta: { title: 'Edit product' },
        },
      ],
    },
    {
      path: '/',
      redirect: '/product/list',
    },
    ...demoRoutes,
  ],
})

export default router

router.beforeEach(async (to, from, next) => {
  document.title = `${to.meta.title}`
  if (to.path === '/callback') {
    next()
    return
  }
  // const user = await userManager.getUser()
  // if (!user) {
  //   login()
  //   return
  // }

  next()
})
