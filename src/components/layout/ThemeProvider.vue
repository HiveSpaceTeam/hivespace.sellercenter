<template>
  <slot></slot>
</template>

<script setup lang="ts">
import { provide, computed } from 'vue'
import type { ComputedRef } from 'vue'
import { useUserStore } from '@/stores/user'
import { getCurrentUser } from '@/auth/user-manager'
import { THEME_TEXT, stringToNumericTheme } from '@/types'
import { setCookie } from '@/utils/cookie'
import { applyThemeToDOM } from '@/utils/theme'
import { themeText } from '@/state/theme.state'

interface ThemeContext {
  isDarkMode: ComputedRef<boolean>
  toggleTheme: () => Promise<void>
}

const userStore = useUserStore()

const isDarkMode = computed(() => themeText.value === THEME_TEXT.DARK)

const toggleTheme = async () => {
  const currentTheme = themeText.value
  const newTheme = currentTheme === THEME_TEXT.LIGHT ? THEME_TEXT.DARK : THEME_TEXT.LIGHT
  const numericTheme = stringToNumericTheme(newTheme)

  // If authenticated, update through store (which calls API)
  const user = await getCurrentUser()
  if (user) {
    await userStore.updateTheme(numericTheme)
  }

  // Persist locally (cookie) and update app-level ref
  setCookie('theme', newTheme, 365) // Store for 1 year
  themeText.value = newTheme
  applyThemeToDOM(newTheme)
}

provide('theme', {
  isDarkMode,
  toggleTheme,
} as ThemeContext)
</script>

<script lang="ts">
import { inject } from 'vue'

interface ThemeContext {
  isDarkMode: ReturnType<typeof computed<boolean>>
  toggleTheme: () => Promise<void>
}

export function useTheme(): ThemeContext {
  const theme = inject<ThemeContext>('theme')
  if (!theme) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return theme
}
</script>
