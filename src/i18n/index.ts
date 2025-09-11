import { createI18n } from 'vue-i18n'

// Import translation files
import vi from './locales/vi.json'
import en from './locales/en.json'

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
