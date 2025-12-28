<template>
  <SidebarProvider>
    <RouterView />
  </SidebarProvider>
  <!-- Global modal outlet -->
  <ModalManager />
  <!-- Global toast notifications -->
  <ToastContainer :toasts="appStore.notifications" :onRemoveToast="appStore.removeNotification" />
</template>

<script setup lang="ts">
import { ToastContainer, SidebarProvider, ModalManager } from '@hivespace/shared'
import { useAppStore } from '@/stores/app'
const appStore = useAppStore()
</script>
