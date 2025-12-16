<template>
  <div class="min-h-screen">
    <!-- Header Only -->
    <AppHeader :show-sidebar-toggle="false" />

    <!-- Main Content -->
    <div class="relative flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-6 overflow-hidden z-1">
      <div>
        <div class="absolute right-0 top-0 -z-1 w-full max-w-62.5 xl:max-w-112.5">
          <img src="/images/shape/grid-01.svg" alt="grid" />
        </div>
        <div class="absolute bottom-0 left-0 -z-1 w-full max-w-62.5 rotate-180 xl:max-w-112.5">
          <img src="/images/shape/grid-01.svg" alt="grid" />
        </div>
      </div>

      <div class="mx-auto w-full max-w-125 text-center">
        <!-- Loading State -->
        <div v-if="isLoading" class="mb-8">
          <LoadingSpinnerIcon class="w-16 h-16 mx-auto mb-4 text-brand-500 animate-spin" />
          <h1 class="mb-2 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
            {{ t('verifyEmailCallback.loading.title') }}
          </h1>
          <p class="text-base text-gray-700 dark:text-gray-400 sm:text-lg">
            {{ t('verifyEmailCallback.loading.subtitle') }}
          </p>
        </div>

        <!-- Success State -->
        <div v-else-if="isSuccess" class="mb-8">
          <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <div
              class="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full dark:bg-green-900/20">
              <CheckLargeIcon class="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h1 class="mb-2 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
              {{ t('verifyEmailCallback.success.title') }}
            </h1>
            <p class="text-base text-gray-700 dark:text-gray-400 mb-6">
              {{ t('verifyEmailCallback.success.subtitle') }}
            </p>

            <!-- Redirect Message with Countdown -->
            <div v-if="returnUrl" class="text-center mb-6">
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {{
                  t('verifyEmailCallback.success.redirectMessage', { seconds: redirectCountdown })
                }}
              </p>
              <Button @click="handleRedirect" variant="primary" class="inline-flex items-center">
                {{ t('verifyEmailCallback.success.clickToRedirect') }}
              </Button>
            </div>

            <!-- No Return URL - Back to Home -->
            <div v-else class="text-center">
              <Button @click="goToHome" variant="primary" class="inline-flex items-center">
                <HomeIcon class="w-4 h-4 mr-2" />
                {{ t('verifyEmailCallback.success.backToHome') }}
              </Button>
            </div>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="isError" class="mb-8">
          <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <div
              class="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full dark:bg-red-900/20">
              <ErrorIcon class="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h1 class="mb-2 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
              {{ t('verifyEmailCallback.error.title') }}
            </h1>
            <p class="text-base text-gray-700 dark:text-gray-400 mb-6">
              {{ errorMessage || t('verifyEmailCallback.error.subtitle') }}
            </p>

            <!-- Error Actions -->
            <div class="flex flex-col sm:flex-row gap-3 justify-center">
              <Button @click="goToVerifyEmail" variant="primary" class="inline-flex items-center">
                <MailIcon class="w-4 h-4 mr-2" />
                {{ t('verifyEmailCallback.error.sendNewEmail') }}
              </Button>
              <Button @click="goToHome" variant="outline" class="inline-flex items-center">
                <HomeIcon class="w-4 h-4 mr-2" />
                {{ t('verifyEmailCallback.error.backToHome') }}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <p class="absolute text-sm text-center text-gray-500 -translate-x-1/2 bottom-6 left-1/2 dark:text-gray-400">
        © {{ currentYear }} - HiveSpace
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/stores/app'
import { accountService } from '@/services'
import { Button } from '@hivespace/shared'
import AppHeader from '@/components/layout/AppHeader.vue'
import LoadingSpinnerIcon from '@/icons/LoadingSpinnerIcon.vue'
import CheckLargeIcon from '@/icons/CheckLargeIcon.vue'
import ErrorIcon from '@/icons/ErrorIcon.vue'
import HomeIcon from '@/icons/HomeIcon.vue'
import MailIcon from '@/icons/MailIcon.vue'
import { useAuth } from '@hivespace/shared'
import refreshToken from '@/services/refresh.service'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const appStore = useAppStore()
const currentYear = new Date().getFullYear()

// State management
const isLoading = ref(true)
const isSuccess = ref(false)
const isError = ref(false)
const errorMessage = ref('')
const returnUrl = ref<string | null>(null)
const redirectCountdown = ref(10)

// Redirect timer
let redirectTimer: number | null = null

// Extract parameters from URL
const extractUrlParams = () => {
  const token = route.query.token as string
  const urlReturnUrl = route.query.returnUrl as string

  if (urlReturnUrl) {
    returnUrl.value = urlReturnUrl
  }

  return { token }
}

// Start redirect countdown
const startRedirectCountdown = () => {
  if (!returnUrl.value) return

  redirectTimer = setInterval(() => {
    redirectCountdown.value--
    if (redirectCountdown.value <= 0) {
      handleRedirect()
    }
  }, 1000)
}

// Stop redirect countdown
const stopRedirectCountdown = () => {
  if (redirectTimer) {
    clearInterval(redirectTimer)
    redirectTimer = null
  }
}

// Handle redirect to return URL
const handleRedirect = () => {
  stopRedirectCountdown()
  if (!returnUrl.value) return

  try {
    // Absolute URL (includes protocol)
    if (returnUrl.value.startsWith('http')) {
      const parsed = new URL(returnUrl.value)
      // Only allow same-origin absolute redirects
      if (parsed.origin === window.location.origin) {
        window.location.href = parsed.toString()
      } else {
        // External origins are not allowed — navigate to a safe default
        router.push('/')
      }
    } else {
      // Relative path — ensure leading slash
      const path = returnUrl.value.startsWith('/') ? returnUrl.value : `/${returnUrl.value}`
      router.push(path)
    }
  } catch {
    // Malformed URL — fallback to safe default
    router.push('/')
  }
}

// Navigate to home
const goToHome = () => {
  router.push('/products/list')
}

// Navigate to verify email page
const goToVerifyEmail = () => {
  router.push('/verify-email')
}

// Verify email with token
const verifyEmailToken = async (token: string) => {
  try {
    await accountService.verifyEmail(token)

    // Success
    isSuccess.value = true
    isLoading.value = false

    // Show success notification
    appStore.notifySuccess(
      t('verifyEmailCallback.success.title'),
      t('verifyEmailCallback.success.subtitle'),
    )

    const { getCurrentUser } = useAuth()
    const currentUser = await getCurrentUser()
    if (currentUser) {
      await refreshToken(currentUser, true)
    }

    // Start countdown if return URL exists
    if (returnUrl.value) {
      startRedirectCountdown()
    }
  } catch (error) {
    console.error('Email verification failed:', error)

    // Error
    isError.value = true
    isLoading.value = false

    // Do not expose raw server error messages to users; use generic translation
    errorMessage.value = ''

    // Show error notification with a generic message
    appStore.notifyError(
      t('verifyEmailCallback.error.title'),
      t('verifyEmailCallback.error.subtitle'),
    )
  }
}

// Initialize component
onMounted(async () => {
  const { getCurrentUser } = useAuth()
  const user = await getCurrentUser()
  if (user?.profile.email_verified) {
    isLoading.value = false
    isSuccess.value = true
    startRedirectCountdown()
    return
  }

  const { token } = extractUrlParams()

  if (!token) {
    // No token provided
    isError.value = true
    isLoading.value = false
    errorMessage.value = t('verifyEmailCallback.error.noToken')
    return
  }

  // Verify the token
  await verifyEmailToken(token)
})

// Cleanup on unmount
onUnmounted(() => {
  stopRedirectCountdown()
})
</script>
