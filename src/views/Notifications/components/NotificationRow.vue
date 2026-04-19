<template>
  <div :class="[
    'flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-white/5',
    !notification.isRead ? 'bg-brand-50/40 dark:bg-brand-900/10' : '',
  ]" @click="emit('click', notification.id)">
    <!-- Avatar -->
    <div class="relative flex-shrink-0">
      <img :src="notification.avatarUrl || defaultAvatar" alt=""
        class="h-12 w-12 rounded-full object-cover" />
      <span
        class="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand-500 border-2 border-white dark:border-gray-900">
        <NotificationBellIcon class="h-2.5 w-2.5 text-white" />
      </span>
    </div>

    <!-- Content -->
    <div class="flex-1 min-w-0">
      <p class="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 leading-snug">{{ notification.message }}</p>
      <p :class="['text-xs mt-1', !notification.isRead ? 'text-brand-500 font-medium' : 'text-gray-400 dark:text-gray-500']">
        {{ formattedTime }}
      </p>
    </div>

    <span v-if="!notification.isRead" class="mt-2 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-brand-500" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import NotificationBellIcon from '@/icons/NotificationBellIcon.vue'
import type { InAppNotification } from '@hivespace/shared'

const defaultAvatar =
  `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' rx='20' fill='%23e5e7eb'/%3E%3Ccircle cx='20' cy='15' r='7' fill='%239ca3af'/%3E%3Cellipse cx='20' cy='34' rx='12' ry='8' fill='%239ca3af'/%3E%3C/svg%3E`

const props = defineProps<{
  notification: InAppNotification
}>()

const emit = defineEmits<{
  (e: 'click', id: string): void
}>()

const { t } = useI18n()

const formattedTime = computed(() => {
  const date = new Date(props.notification.createdAt)
  const diff = Date.now() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return t('common.notifications.justNow')
  if (minutes < 60) return t('common.notifications.minutesAgo', { count: minutes })
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return t('common.notifications.hoursAgo', { count: hours })
  return date.toLocaleDateString('vi-VN')
})
</script>
