<template>
  <div class="relative">
    <button
      @click="toggleLanguageMenu"
      class="flex items-center gap-2 p-2 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
    >
      <!-- Current Language Flag -->
      <svg
        v-if="currentLocale === 'vi'"
        class="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect y="3" width="24" height="18" rx="3.67347" fill="#DA251D" />
        <path
          d="M12 6L13.5 10.5H18L14.25 13.5L15.75 18L12 15L8.25 18L9.75 13.5L6 10.5H10.5L12 6Z"
          fill="#FFFF00"
        />
      </svg>
      <svg
        v-else
        class="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect y="3" width="24" height="18" rx="3.42857" fill="#012169" />
        <path d="M0 0L24 24M24 0L0 24" stroke="#FFFFFF" stroke-width="3" />
        <path d="M0 0L24 24M24 0L0 24" stroke="#C8102E" stroke-width="2" />
        <path d="M12 0V24M0 12H24" stroke="#FFFFFF" stroke-width="5" />
        <path d="M12 0V24M0 12H24" stroke="#C8102E" stroke-width="3" />
      </svg>

      <span class="text-sm font-medium">{{ currentLocale.toUpperCase() }}</span>
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <!-- Language Menu -->
    <div
      v-if="isOpen"
      class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
    >
      <div class="py-1">
        <button
          @click="changeLanguage('vi')"
          class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          <svg
            class="w-5 h-5 mr-3"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect y="3" width="24" height="18" rx="3.67347" fill="#DA251D" />
            <path
              d="M12 6L13.5 10.5H18L14.25 13.5L15.75 18L12 15L8.25 18L9.75 13.5L6 10.5H10.5L12 6Z"
              fill="#FFFF00"
            />
          </svg>
          Tiếng Việt
        </button>
        <button
          @click="changeLanguage('en')"
          class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          <svg
            class="w-5 h-5 mr-3"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect y="3" width="24" height="18" rx="3.42857" fill="#012169" />
            <path d="M0 0L24 24M24 0L0 24" stroke="#FFFFFF" stroke-width="3" />
            <path d="M0 0L24 24M24 0L0 24" stroke="#C8102E" stroke-width="2" />
            <path d="M12 0V24M0 12H24" stroke="#FFFFFF" stroke-width="5" />
            <path d="M12 0V24M0 12H24" stroke="#C8102E" stroke-width="3" />
          </svg>
          English
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const isOpen = ref(false)

const currentLocale = computed(() => locale.value)

const toggleLanguageMenu = () => {
  isOpen.value = !isOpen.value
}

const changeLanguage = (lang) => {
  locale.value = lang
  localStorage.setItem('locale', lang)
  isOpen.value = false
}

const handleClickOutside = (event) => {
  if (!event.target.closest('.relative')) {
    isOpen.value = false
  }
}

onMounted(() => {
  // Load saved locale from localStorage
  const savedLocale = localStorage.getItem('locale')
  if (savedLocale && ['vi', 'en'].includes(savedLocale)) {
    locale.value = savedLocale
  }

  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
