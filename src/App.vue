<template>
  <SidebarProvider>
    <RouterView @navigate="handleNavigate" />
  </SidebarProvider>
  <!-- Global modal outlet -->
  <ModalManager />
  <!-- Global toast notifications -->
  <ToastContainer :toasts="appStore.notifications" @removeToast="appStore.removeNotification" />
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ToastContainer, SidebarProvider, ModalManager } from '@hivespace/shared'
import { useAppStore } from '@hivespace/shared'
const appStore = useAppStore()
const router = useRouter()

const handleNavigate = (path: string) => {
  router.push(path)
}
</script>
