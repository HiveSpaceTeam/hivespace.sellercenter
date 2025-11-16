<template>
  <div class="min-h-screen">
    <!-- Header Only -->
    <AppHeader :show-sidebar-toggle="false" />

    <!-- Main Content -->
    <div class="relative flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-6 overflow-hidden z-1">
      <div>
        <div class="absolute right-0 top-0 -z-1 w-full max-w-[250px] xl:max-w-[450px]">
          <img src="/images/shape/grid-01.svg" alt="grid" />
        </div>
        <div class="absolute bottom-0 left-0 -z-1 w-full max-w-[250px] rotate-180 xl:max-w-[450px]">
          <img src="/images/shape/grid-01.svg" alt="grid" />
        </div>
      </div>

      <div class="mx-auto w-full max-w-[500px] text-center">
        <!-- Title and Description -->
        <div class="mb-8">
          <MailIcon class="w-16 h-16 mx-auto mb-4 text-brand-500" />
          <h1 class="mb-2 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
            {{ t('verifyEmail.title') }}
          </h1>
          <p class="text-base text-gray-700 dark:text-gray-400 sm:text-lg">
            {{ t('verifyEmail.subtitle') }}
          </p>
        </div>

        <!-- Success State -->
        <div v-if="isSuccess"
          class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div
            class="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-green-100 rounded-full dark:bg-green-900/20">
            <CheckLargeIcon class="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <h3 class="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
            {{ t('verifyEmail.messages.success') }}
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {{ t('verifyEmail.messages.verificationSent') }}
          </p>
          <div class="text-sm text-gray-600 dark:text-gray-400 space-y-2">
            <p>{{ t('verifyEmail.help.checkInbox') }}</p>
            <p>{{ t('verifyEmail.help.clickLink') }}</p>
          </div>
        </div>

        <!-- Form State -->
        <div v-if="!isSuccess"
          class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <form @submit.prevent="handleSubmit" class="text-left space-y-6">
            <!-- Form Errors -->
            <div v-if="formErrors.common.length > 0"
              class="p-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800" role="alert">
              <template v-if="formErrors.common.length === 1">
                <div>{{ formErrors.common[0] }}</div>
              </template>
              <template v-else>
                <ul class="mt-2 ml-4 list-disc list-inside space-y-1">
                  <li v-for="(error, index) in formErrors.common" :key="index">
                    {{ error }}
                  </li>
                </ul>
              </template>
            </div>

            <!-- Email Input -->
            <div>
              <div class="flex items-center justify-between mb-1.5">
                <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-400 required-label">
                  {{ t('verifyEmail.fields.emailAddress') }}
                </label>
                <button v-if="!isEmailEditing" type="button" @click="enableEmailEditing"
                  class="inline-flex items-center text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                  :class="[
                    isSubmitting || cooldownActive
                      ? 'text-gray-400 dark:text-gray-500'
                      : 'text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300',
                  ]" :disabled="isSubmitting || cooldownActive">
                  <EditIcon class="w-4 h-4 mr-1" />
                  {{ t('verifyEmail.actions.editEmail') }}
                </button>
              </div>
              <div class="flex items-center space-x-2">
                <div class="flex-1">
                  <Input v-model="formData.email" type="email" id="email"
                    :placeholder="t('verifyEmail.placeholders.emailAddress')" :error="formErrors.email" required
                    :disabled="!isEmailEditing || isSubmitting || cooldownActive" />
                </div>
                <div v-if="isEmailEditing" class="flex items-center space-x-2">
                  <Button type="button" @click="confirmEmailEdit" variant="primary" size="sm" class="px-3 py-2"
                    :disabled="isSubmitting || cooldownActive">
                    <CheckIcon class="w-4 h-4" />
                  </Button>
                  <Button type="button" @click="cancelEmailEdit" variant="outline" size="sm" class="px-3 py-2"
                    :disabled="isSubmitting || cooldownActive">
                    <CloseIcon class="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            <!-- Submit Button -->
            <div class="flex flex-col space-y-3">
              <Button type="submit" :disabled="isSubmitting || cooldownActive" variant="primary" class="w-full h-11">
                <template v-if="isSubmitting">
                  <LoadingSpinnerIcon class="w-4 h-4 mr-2" />
                  {{ t('verifyEmail.actions.sendVerification') }}
                </template>
                <template v-else-if="cooldownActive">
                  {{ t('verifyEmail.actions.resendVerification') }} ({{ cooldownSeconds }}s)
                </template>
                <template v-else>
                  {{
                    sentBefore
                      ? t('verifyEmail.actions.resendVerification')
                      : t('verifyEmail.actions.sendVerification')
                  }}
                </template>
              </Button>

              <!-- Cooldown info -->
              <p v-if="cooldownActive" class="text-xs text-gray-500 dark:text-gray-400 text-center">
                {{ t('verifyEmail.messages.cooldownActive') }}
              </p>

              <!-- Help text -->
              <div v-else class="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                <p class="text-center">
                  {{ t('verifyEmail.help.resendInfo', { seconds: COOLDOWN_SECONDS }) }}
                </p>
              </div>
            </div>
          </form>
        </div>

        <!-- Additional Help -->
        <div class="text-center">
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {{ t('verifyEmail.help.contactSupport') }}
          </p>
        </div>
      </div>

      <p class="absolute text-sm text-center text-gray-500 -translate-x-1/2 bottom-6 left-1/2 dark:text-gray-400">
        © {{ currentYear }} - HiveSpace
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/stores/app'
import { accountService } from '@/services'
import { useFieldValidation } from '@/composables/useFieldValidation'
import { getCurrentUser } from '@/auth/user-manager'
import type { ErrorResponse } from '@/types'
import Button from '@/components/common/Button.vue'
import Input from '@/components/common/Input.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import MailIcon from '@/icons/MailIcon.vue'
import CheckLargeIcon from '@/icons/CheckLargeIcon.vue'
import LoadingSpinnerIcon from '@/icons/LoadingSpinnerIcon.vue'
import EditIcon from '@/icons/EditIcon.vue'
import CheckIcon from '@/icons/CheckIcon.vue'
import CloseIcon from '@/icons/CloseIcon.vue'

const router = useRouter()
const { t } = useI18n()
const appStore = useAppStore()
const { handleFieldValidationErrors, clearFieldErrors } = useFieldValidation()
const currentYear = new Date().getFullYear()
// Constants
const COOLDOWN_SECONDS = 60

// Form data
const formData = reactive({
  email: '',
})

// Form error types
interface FormErrors {
  common: string[]
  email: string
}

// Form errors
const formErrors = reactive<FormErrors>({
  common: [],
  email: '',
})

// State management
const isSubmitting = ref(false)
const isSuccess = ref(false)
const sentBefore = ref(false)
const cooldownActive = ref(false)
const cooldownSeconds = ref(COOLDOWN_SECONDS)
const isEmailEditing = ref(false)
const originalEmail = ref('')

// Cooldown timer
let cooldownTimer: number | null = null

// Clear all form errors
const clearErrors = () => {
  formErrors.common = []
  formErrors.email = ''
}

// Start cooldown timer
const startCooldown = () => {
  cooldownActive.value = true
  cooldownSeconds.value = COOLDOWN_SECONDS

  cooldownTimer = setInterval(() => {
    cooldownSeconds.value--
    if (cooldownSeconds.value <= 0) {
      stopCooldown()
    }
  }, 1000)
}

// Stop cooldown timer
const stopCooldown = () => {
  cooldownActive.value = false
  cooldownSeconds.value = COOLDOWN_SECONDS
  if (cooldownTimer) {
    clearInterval(cooldownTimer)
    cooldownTimer = null
  }
}

// Validate form
const validateForm = (): boolean => {
  clearErrors()
  let isValid = true

  if (!formData.email.trim()) {
    formErrors.email = t('verifyEmail.errors.emailRequired')
    isValid = false
  } else if (!isValidEmail(formData.email)) {
    formErrors.email = t('verifyEmail.errors.emailInvalid')
    isValid = false
  }

  return isValid
}

// Email validation helper
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Email editing functions
const enableEmailEditing = () => {
  originalEmail.value = formData.email
  isEmailEditing.value = true
  // Clear any existing errors when entering edit mode
  formErrors.email = ''
}

const confirmEmailEdit = () => {
  // Validate the new email before confirming
  if (!formData.email.trim()) {
    formErrors.email = t('verifyEmail.errors.emailRequired')
    return
  } else if (!isValidEmail(formData.email)) {
    formErrors.email = t('verifyEmail.errors.emailInvalid')
    return
  }

  // If validation passes, confirm the edit
  isEmailEditing.value = false
  formErrors.email = ''

  // Show feedback if email was changed
  if (originalEmail.value !== formData.email) {
    appStore.notifySuccess(
      t('verifyEmail.messages.emailUpdated'),
      t('verifyEmail.messages.emailUpdatedSuccess'),
    )
  }
}

const cancelEmailEdit = () => {
  // Restore original email
  formData.email = originalEmail.value
  isEmailEditing.value = false
  formErrors.email = ''
}

// Handle form submission
const handleSubmit = async () => {
  if (!validateForm()) {
    appStore.notifyError(
      t('verifyEmail.messages.error'),
      t('verifyEmail.messages.validationFailed'),
    )
    return
  }

  isSubmitting.value = true

  try {
    // Clear any previous errors
    clearFieldErrors(formErrors)

    // Generate callback URL and return URL
    const baseUrl = window.location.origin
    const callbackUrl = `${baseUrl}/verify-email-callback`
    const returnUrl = '/register-seller'

    // Send verification email - returns HTTP 202 Accepted if successful
    await accountService.sendVerificationEmail(callbackUrl, returnUrl)

    // If we reach here, the request was successful (no exception thrown)
    isSuccess.value = true
    sentBefore.value = true

    // Start cooldown to prevent spam
    startCooldown()

    appStore.notifySuccess(
      t('verifyEmail.messages.success'),
      t('verifyEmail.messages.verificationSent'),
    )
  } catch (error) {
    console.error('Failed to send verification email:', error)

    // Handle API error response
    const errorData = error as ErrorResponse

    // Try to handle field-specific validation errors first
    const hasFieldErrors = handleFieldValidationErrors(errorData, formErrors)

    // If no field errors, show general error notification
    if (!hasFieldErrors) {
      const errorMessage = error instanceof Error ? error.message : t('errors.UNKNOWN_ERROR')
      appStore.notifyError(t('verifyEmail.messages.error'), errorMessage as string)
    }
  } finally {
    isSubmitting.value = false
  }
}

// Initialize component
onMounted(async () => {
  try {
    // Get current user and check email verification status
    const currentUser = await getCurrentUser()
    if (currentUser) {
      // If email is already verified, redirect to register store
      if (currentUser.profile?.email_verified) {
        await router.push('/register-seller')
        return
      }

      // Pre-fill email from current user if available
      if (currentUser.profile?.email) {
        formData.email = currentUser.profile.email
      }
    }
  } catch (error) {
    console.warn('Could not load current user email:', error)
  }
})

// Cleanup on unmount
onUnmounted(() => {
  stopCooldown()
})
</script>
