<template>
  <SidebarProvider>
    <RouterView @navigate="handleNavigate" />
  </SidebarProvider>
  <!-- Global modal outlet -->
  <ModalManager />
  <!-- Global toast notifications -->
  <ToastContainer :toasts="appStore.notifications" @removeToast="appStore.removeNotification" />
  <!-- In-app notification preview toasts — bottom-right -->
  <NotificationPreviewToast :toasts="toastQueue" @dismiss="notificationStore.dismissToast" @click="handleToastClick" />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ToastContainer, SidebarProvider, ModalManager, useAuth, useNotificationHub, NotificationPreviewToast } from '@hivespace/shared'
import { useAppStore } from '@hivespace/shared'
import { useNotificationStore } from '@/stores'
import { config } from '@/config'
import { storeToRefs } from 'pinia'

const appStore = useAppStore()
const router = useRouter()
const { currentUser, getCurrentUser } = useAuth()
const notificationStore = useNotificationStore()
const { toastQueue } = storeToRefs(notificationStore)

const { connect, disconnect } = useNotificationHub(
  config.api.baseUrl,
  (event) => notificationStore.prependFromHub(event),
)

const handleNavigate = (path: string) => {
  router.push(path)
}

const handleToastClick = (id: string) => {
  const notification = toastQueue.value.find((n) => n.id === id)
  notificationStore.markAsRead(id)
  notificationStore.dismissToast(id)
  router.push(notification?.link ?? '/notifications')
}

const initNotifications = async () => {
  await connect()
}

onMounted(async () => {
  // getCurrentUser() validates the token — safer than reading isAuthenticated
  // which may reflect stale storage before OIDC session is confirmed
  const user = await getCurrentUser()
  if (user) {
    await initNotifications()
    await notificationStore.fetchUnreadCount()
  }
})

watch(currentUser, async (user, prevUser) => {
  const tokenChanged = user?.access_token !== prevUser?.access_token
  if (user && tokenChanged) {
    await initNotifications()
    await notificationStore.fetchUnreadCount()
  } else if (!user && prevUser) {
    await disconnect()
  }
})

onUnmounted(async () => {
  await disconnect()
})
</script>
