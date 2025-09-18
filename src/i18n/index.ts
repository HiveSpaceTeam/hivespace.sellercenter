import { createI18n } from 'vue-i18n'

// Import modular translation aggregators
import vi from './locales/vi'
import en from './locales/en'

const i18n = createI18n({
  legacy: false,
  locale: 'vi', // default locale
  fallbackLocale: 'en',
  messages: {
    vi,
    en
  }
})

export default i18n
