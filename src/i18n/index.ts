import { createI18n } from 'vue-i18n'

// Import English translation files
import enCommon from './locales/en/common.json'
import enAdmins from './locales/en/admins.json'
import enUsers from './locales/en/users.json'
import enPages from './locales/en/pages.json'
import enErrors from './locales/en/errors.json'
import enBackendErrors from './locales/en/backend-errors.json'

// Import Vietnamese translation files
import viCommon from './locales/vi/common.json'
import viAdmins from './locales/vi/admins.json'
import viUsers from './locales/vi/users.json'
import viPages from './locales/vi/pages.json'
import viErrors from './locales/vi/errors.json'
import viBackendErrors from './locales/vi/backend-errors.json'

// Merge translations for each language
const en = {
  common: enCommon,
  admins: enAdmins,
  users: enUsers,
  pages: enPages,
  errors: enErrors,
  backendErrors: enBackendErrors,
}

const vi = {
  common: viCommon,
  admins: viAdmins,
  users: viUsers,
  pages: viPages,
  errors: viErrors,
  backendErrors: viBackendErrors,
}

const i18n = createI18n({
  legacy: false,
  locale: 'vi', // default locale
  fallbackLocale: 'en',
  messages: {
    vi,
    en,
  },
})

export default i18n
