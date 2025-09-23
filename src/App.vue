<template>
  <ThemeProvider>
    <SidebarProvider>
      <RouterView />
    </SidebarProvider>
    <!-- Global modal outlet -->
    <ModalManager />
    <!-- Global toast notifications -->
    <ToastContainer />
  </ThemeProvider>
</template>

<script setup lang="ts">
import ThemeProvider from '@/components/layout/ThemeProvider.vue'
import SidebarProvider from '@/components/layout/SidebarProvider.vue'
import ModalManager from '@/components/modal/ModalManager.vue'
import ToastContainer from '@/components/common/ToastContainer.vue'
</script>
