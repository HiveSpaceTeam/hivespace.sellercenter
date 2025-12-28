<template>
  <header
    class="sticky top-0 flex w-full bg-white border-gray-200 z-999 dark:border-gray-800 dark:bg-gray-900 lg:border-b"
  >
    <div class="flex flex-col items-center justify-between grow lg:flex-row lg:px-6">
      <div
        class="flex items-center justify-between w-full gap-2 px-3 py-3 border-b border-gray-200 dark:border-gray-800 sm:gap-4 lg:justify-normal lg:border-b-0 lg:px-0 lg:py-4"
      >
        <button
          v-if="props.showSidebarToggle"
          @click="handleToggle"
          :aria-label="isMobileOpen ? $t('sidebar.close') : $t('sidebar.open')"
          :aria-expanded="isMobileOpen"
          class="flex items-center justify-center w-10 h-10 text-gray-500 border-gray-200 rounded-lg z-999 dark:border-gray-800 dark:text-gray-400 lg:h-11 lg:w-11 lg:border"
          :class="[
            isMobileOpen
              ? 'lg:bg-transparent dark:lg:bg-transparent bg-gray-100 dark:bg-gray-800'
              : '',
          ]"
        >
          <CloseMenuIcon v-if="isMobileOpen" />
          <MenuIcon v-else />
        </button>
        <!-- Spacer when toggle button is hidden to maintain layout -->
        <div v-else class="w-10 h-10 lg:w-11 lg:h-11"></div>
        <button
          @click="toggleApplicationMenu"
          :aria-label="
            isApplicationMenuOpen
              ? $t('header.applicationMenu.close')
              : $t('header.applicationMenu.open')
          "
          :aria-expanded="isApplicationMenuOpen"
          aria-controls="application-menu"
          class="flex items-center justify-center w-10 h-10 text-gray-700 rounded-lg z-999 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 lg:hidden"
        >
          <MenuDotsIcon />
        </button>
        <HeaderLogo />
        <button
          @click="toggleApplicationMenu"
          class="flex items-center justify-center w-10 h-10 text-gray-700 rounded-lg z-999 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 lg:hidden"
        >
          <MenuDotsIcon />
        </button>
      </div>

      <div
        :class="[isApplicationMenuOpen ? 'flex' : 'hidden']"
        class="items-center justify-between w-full gap-4 px-5 py-4 shadow-theme-md lg:flex lg:justify-end lg:px-0 lg:shadow-none"
      >
        <div class="flex items-center gap-2 2xsm:gap-3">
          <ThemeToggler @theme-changed="handleThemeChange" />
          <LanguageSwitcher @language-changed="handleCultureChange" />
          <NotificationMenu />
        </div>
        <UserMenu :user="user" :menu-items="menuItems" :show-sign-out="true" @sign-out="logout" />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import {
  useSidebar,
  useAuth,
  ThemeToggler,
  HeaderLogo,
  NotificationMenu,
  UserMenu,
  LanguageSwitcher,
  type MenuItem,
  stringToNumericTheme,
  stringToNumericCulture,
} from '@hivespace/shared'

import CloseMenuIcon from '@/icons/CloseMenuIcon.vue'
import MenuIcon from '@/icons/MenuIcon.vue'
import MenuDotsIcon from '@/icons/MenuDotsIcon.vue'
import UserCircleIcon from '@/icons/UserCircleIcon.vue'
import SettingsIcon from '@/icons/SettingsIcon.vue'
import SupportIcon from '@/icons/SupportIcon.vue'
import { useUserStore } from '@/stores'

interface Props {
  showSidebarToggle?: boolean
}

const { getCurrentUser, logout } = useAuth()
const props = withDefaults(defineProps<Props>(), {
  showSidebarToggle: true,
})
const userStore = useUserStore()
const user = ref()

const menuItems: MenuItem[] = [
  { href: '/profile', icon: UserCircleIcon, textKey: 'common.profile.editProfile' },
  { href: '/chat', icon: SettingsIcon, textKey: 'common.profile.accountSettings' },
  { href: '/profile', icon: SupportIcon, textKey: 'common.profile.support' },
]

const { toggleSidebar, toggleMobileSidebar, isMobileOpen } = useSidebar()

const handleToggle = () => {
  if (window.innerWidth >= 1024) {
    toggleSidebar()
  } else {
    toggleMobileSidebar()
  }
}

const handleThemeChange = async (theme: string) => {
  await userStore.updateTheme(stringToNumericTheme(theme))
}

const handleCultureChange = async (culture: string) => {
  await userStore.updateCulture(stringToNumericCulture(culture))
}

// const dropdownOpen = ref(false)
// const notifying = ref(false)

// const toggleDropdown = () => {
//   dropdownOpen.value = !dropdownOpen.value
//   notifying.value = false
// }

const isApplicationMenuOpen = ref(false)

const toggleApplicationMenu = () => {
  isApplicationMenuOpen.value = !isApplicationMenuOpen.value
}

onMounted(async () => {
  user.value = await getCurrentUser()
})
</script>
