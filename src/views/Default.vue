<template>
  <div
    class="relative flex flex-col items-center justify-center min-h-screen p-6 overflow-hidden z-1"
  >
    <!-- Language Switcher and Theme Toggler - Top Right -->
    <div class="absolute top-4 right-4 z-10 flex items-center gap-3">
      <ThemeToggler />
      <LanguageSwitcher />
    </div>

    <div>
      <div class="absolute right-0 top-0 -z-1 w-full max-w-[250px] xl:max-w-[450px]">
        <img src="/images/shape/grid-01.svg" alt="grid" />
      </div>
      <div class="absolute bottom-0 left-0 -z-1 w-full max-w-[250px] rotate-180 xl:max-w-[450px]">
        <img src="/images/shape/grid-01.svg" alt="grid" />
      </div>
    </div>

    <div class="mx-auto w-full max-w-[242px] text-center sm:max-w-[562px]">
      <img class="dark:hidden w-full h-auto" src="/images/logo/logo-light.svg" alt="home" />
      <img class="hidden dark:block w-full h-auto" src="/images/logo/logo-dark.svg" alt="home" />
      <p class="mt-10 mb-6 text-base text-gray-700 dark:text-gray-400 sm:text-lg">
        {{ t('pages.default.welcome') }}
      </p>
      <Button :disabled="isSigningIn" @click="signIn" variant="primary">
        {{ t('pages.default.signIn') }}
      </Button>
      <Button class="ml-4" @click="signIn" variant="outline">
        {{ t('pages.default.signUp') }}
      </Button>
    </div>

    <p
      class="absolute text-sm text-center text-gray-500 -translate-x-1/2 bottom-6 left-1/2 dark:text-gray-400"
    >
      © 2025 - HiveSpace
    </p>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '@hivespace/shared'
import { useRouter } from 'vue-router'
import { Button, ThemeToggler } from '@hivespace/shared'
import { onMounted, ref } from 'vue'
import type { AppUser } from '@hivespace/shared'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const isSigningIn = ref(false)
const { t } = useI18n()

// Helper: check current local user once and navigate to account if present.
async function checkUserAndRedirect(): Promise<AppUser | null> {
  try {
    const { getCurrentUser } = useAuth()
    const user = await getCurrentUser()
    if (user) {
      // If the user already appears signed in locally, go to user management
      await router.push('/product/list')
      return user
    }
    return null
  } catch (err) {
    // Don't block the UI on unexpected storage/read errors. Log for diagnostics.
    console.error('Error checking current user', err)
    return null
  }
}

onMounted(() => {
  // fire-and-forget; if there's a local user navigate away immediately
  void checkUserAndRedirect()
})

const signIn = async () => {
  if (isSigningIn.value) return
  isSigningIn.value = true
  try {
    // Always start a fresh IdP login flow. Do not reuse any existing local user.
    const { login } = useAuth()
    await login()
  } catch (err) {
    console.error('Sign-in failed', err)
  } finally {
    isSigningIn.value = false
  }
}
</script>
