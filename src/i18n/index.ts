import { createI18n } from 'vue-i18n'

// Import English translation files
import enCommon from './locales/en/common.json'
import enPages from './locales/en/pages.json'
import enErrors from './locales/en/errors.json'
import enBackendErrors from './locales/en/backend-errors.json'
import enRegisterSeller from './locales/en/register-seller.json'
import enComponent from './locales/en/component.json'
import enVerifyEmail from './locales/en/verifyEmail.json'
import enVerifyEmailCallback from './locales/en/verifyEmailCallback.json'
import enProduct from './locales/en/product.json'

// Import Vietnamese translation files
import viCommon from './locales/vi/common.json'
import viPages from './locales/vi/pages.json'
import viErrors from './locales/vi/errors.json'
import viBackendErrors from './locales/vi/backend-errors.json'
import viRegisterSeller from './locales/vi/register-seller.json'
import viComponent from './locales/vi/component.json'
import viVerifyEmail from './locales/vi/verifyEmail.json'
import viVerifyEmailCallback from './locales/vi/verifyEmailCallback.json'
import viProduct from './locales/vi/product.json'

// Merge translations for each language
const en = {
  common: enCommon,
  pages: enPages,
  errors: enErrors,
  backendErrors: enBackendErrors,
  registerSeller: enRegisterSeller,
  component: enComponent,
  verifyEmail: enVerifyEmail,
  verifyEmailCallback: enVerifyEmailCallback,
  product: enProduct,
}

const vi = {
  common: viCommon,
  product: viProduct,
  pages: viPages,
  errors: viErrors,
  backendErrors: viBackendErrors,
  registerSeller: viRegisterSeller,
  component: viComponent,
  verifyEmail: viVerifyEmail,
  verifyEmailCallback: viVerifyEmailCallback,
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
