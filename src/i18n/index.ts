import { createI18n } from 'vue-i18n'
import { CULTURE_TEXT, en as sharedEn, vi as sharedVi } from '@hivespace/shared'

// Import English translation files
import enPages from './locales/en/pages.json'
import enErrors from './locales/en/errors.json'
import enBackendErrors from './locales/en/backend-errors.json'
import enRegisterStore from './locales/en/register-store.json'
import enVerifyEmail from './locales/en/verifyEmail.json'
import enVerifyEmailCallback from './locales/en/verifyEmailCallback.json'
import enProduct from './locales/en/product.json'

// Import Vietnamese translation files
import viPages from './locales/vi/pages.json'
import viErrors from './locales/vi/errors.json'
import viBackendErrors from './locales/vi/backend-errors.json'
import viRegisterStore from './locales/vi/register-store.json'
import viVerifyEmail from './locales/vi/verifyEmail.json'
import viVerifyEmailCallback from './locales/vi/verifyEmailCallback.json'
import viProduct from './locales/vi/product.json'

// Merge translations for each language
const en = {
  ...sharedEn,
  pages: enPages,
  errors: enErrors,
  backendErrors: enBackendErrors,
  registerStore: enRegisterStore,
  verifyEmail: enVerifyEmail,
  verifyEmailCallback: enVerifyEmailCallback,
  product: enProduct,
}

const vi = {
  ...sharedVi,
  product: viProduct,
  pages: viPages,
  errors: viErrors,
  backendErrors: viBackendErrors,
  registerStore: viRegisterStore,
  verifyEmail: viVerifyEmail,
  verifyEmailCallback: viVerifyEmailCallback,
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
