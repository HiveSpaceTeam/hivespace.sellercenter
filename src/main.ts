import '@vueup/vue-quill/dist/vue-quill.snow.css';
import './assets/main.css'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'jsvectormap/dist/jsvectormap.css'
import 'flatpickr/dist/flatpickr.css'
import 'vue-final-modal/style.css'

import { createVfm } from 'vue-final-modal'
import i18n from './i18n'
import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import VueApexCharts from 'vue3-apexcharts'

const app = createApp(App)
const vfm = createVfm()
app.use(vfm)
app.use(router)
app.use(i18n)
app.use(VueApexCharts)

app.mount('#app')
