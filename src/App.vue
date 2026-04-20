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
import { onMounted, onUnmounted, ref, watch } from 'vue'
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
const isHubConnected = ref(false)

const { connect, disconnect } = useNotificationHub(
  config.api.baseUrl,
  (event) => notificationStore.prependFromHub(event),
)

const connectHub = async () => {
  if (isHubConnected.value) return
  await connect()
  isHubConnected.value = true
}

const disconnectHub = async () => {
  if (!isHubConnected.value) return
  await disconnect()
  isHubConnected.value = false
}

const handleNavigate = (path: string) => {
  router.push(path)
}

const handleToastClick = (id: string) => {
  const notification = toastQueue.value.find((n) => n.id === id)
  void notificationStore.markAsRead(id).catch((error) => {
    console.error('Failed to mark notification as read:', error)
  })
  notificationStore.dismissToast(id)
  router.push(notification?.link ?? '/notifications')
}

onMounted(() => {
  // getCurrentUser() validates the token — safer than reading isAuthenticated
  // which may reflect stale storage before OIDC session is confirmed
  // Watcher below handles connection lifecycle.
  void getCurrentUser()
})

watch(() => currentUser.value?.access_token, async (token, prevToken) => {
  if (token) {
    if (prevToken && prevToken !== token) {
      await disconnectHub()
    }
    await connectHub()
    await notificationStore.fetchUnreadCount()
  } else if (prevToken) {
    await disconnectHub()
  }
}, { immediate: true })

onUnmounted(async () => {
  await disconnectHub()
})
</script>
