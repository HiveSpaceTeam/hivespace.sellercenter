// Demo routes (development-only). Extracted from router/index.ts to keep index small.
export const demoRoutes = import.meta.env.DEV ? [
  {
    path: '/demo',
    component: () => import('@/views/Demo/DemoLayout.vue'),
    children: [
      {
        path: '',
        name: 'Ecommerce',
        component: () => import('@/views/Demo/Ecommerce/Ecommerce.vue'),
        meta: { title: 'eCommerce Dashboard' },
      },
      {
        path: 'calendar',
        name: 'Calendar',
        component: () => import('@/views/Demo/Others/Calendar.vue'),
        meta: { title: 'Calendar' },
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/views/Demo/Others/UserProfile.vue'),
        meta: { title: 'Profile' },
      },
      {
        path: 'form-elements',
        name: 'Form Elements',
        component: () => import('@/views/Demo/Forms/FormElements.vue'),
        meta: { title: 'Form Elements' },
      },
      {
        path: 'quill',
        name: 'Quill',
        component: () => import('@/views/Demo/Forms/Quill.vue'),
        meta: { title: 'Quill' },
      },
      {
        path: 'basic-tables',
        name: 'Basic Tables',
        component: () => import('@/views/Demo/Tables/BasicTables.vue'),
        meta: { title: 'Basic Tables' },
      },
      {
        path: 'line-chart',
        name: 'Line Chart',
        component: () => import('@/views/Demo/Chart/LineChart/LineChart.vue'),
      },
      {
        path: 'bar-chart',
        name: 'Bar Chart',
        component: () => import('@/views/Demo/Chart/BarChart/BarChart.vue'),
      },
      {
        path: 'alerts',
        name: 'Alerts',
        component: () => import('@/views/Demo/UiElements/Alerts.vue'),
        meta: { title: 'Alerts' },
      },
      {
        path: 'avatars',
        name: 'Avatars',
        component: () => import('@/views/Demo/UiElements/Avatars.vue'),
        meta: { title: 'Avatars' },
      },
      {
        path: 'badge',
        name: 'Badge',
        component: () => import('@/views/Demo/UiElements/Badges.vue'),
        meta: { title: 'Badge' },
      },
      {
        path: 'buttons',
        name: 'Buttons',
        component: () => import('@/views/Demo/UiElements/Buttons.vue'),
        meta: { title: 'Buttons' },
      },
      {
        path: 'images',
        name: 'Images',
        component: () => import('@/views/Demo/UiElements/Images.vue'),
        meta: { title: 'Images' },
      },
      {
        path: 'videos',
        name: 'Videos',
        component: () => import('@/views/Demo/UiElements/Videos.vue'),
        meta: { title: 'Videos' },
      },
      {
        path: 'blank',
        name: 'Blank',
        component: () => import('@/views/Demo/Pages/BlankPage.vue'),
        meta: { title: 'Blank' },
      },
      {
        path: 'error-404',
        name: '404 Error',
        component: () => import('@/views/Demo/Errors/FourZeroFour.vue'),
        meta: { title: '404 Error' },
      },
      {
        path: 'signin',
        name: 'Signin',
        component: () => import('@/views/Demo/Auth/Signin.vue'),
        meta: { title: 'Signin' },
      },
      {
        path: 'signup',
        name: 'Signup',
        component: () => import('@/views/Demo/Auth/Signup.vue'),
        meta: { title: 'Signup' },
      },
      {
        path: 'icons',
        name: 'Icons',
        component: () => import('@/views/Demo/Icons.vue'),
        meta: { title: 'Icons' },
      },
    ],
  },
] : [];

export default demoRoutes;
