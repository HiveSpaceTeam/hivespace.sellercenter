import { createI18n } from 'vue-i18n'
import { CULTURE_TEXT } from '@/types'

// Import English translation files
import enCommon from './locales/en/common.json'
import enPages from './locales/en/pages.json'
import enErrors from './locales/en/errors.json'
import enBackendErrors from './locales/en/backend-errors.json'
import enComponent from './locales/en/component.json'

// Import Vietnamese translation files
import viCommon from './locales/vi/common.json'
import viPages from './locales/vi/pages.json'
import viErrors from './locales/vi/errors.json'
import viBackendErrors from './locales/vi/backend-errors.json'
import viComponent from './locales/vi/component.json'

// Merge translations for each language
const en = {
  common: enCommon,
  pages: enPages,
  errors: enErrors,
  backendErrors: enBackendErrors,
  component: enComponent,
}

const vi = {
  common: viCommon,
  pages: viPages,
  errors: viErrors,
  backendErrors: viBackendErrors,
  component: viComponent,
}

const i18n = createI18n({
  legacy: false,
  locale: CULTURE_TEXT.VIETNAMESE, // default locale
  fallbackLocale: CULTURE_TEXT.ENGLISH,
  messages: {
    [CULTURE_TEXT.VIETNAMESE]: vi,
    [CULTURE_TEXT.ENGLISH]: en,
  },
})

export default i18n
