<template>
  <Teleport to="body">
    <!-- Toast Container positioned at top-right -->
    <div
      class="fixed top-4 right-4 left-4 sm:left-auto pointer-events-none z-[9999] space-y-3 max-w-sm sm:max-w-sm ml-auto"
    >
      <Toast
        v-for="toast in toasts"
        :key="toast.id"
        :id="toast.id"
        :variant="toast.type"
        :title="toast.title"
        :message="toast.message"
        :duration="toast.duration"
        :show-progress="true"
        @close="removeToast"
      />
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Toast from './Toast.vue'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()

// Get toasts from store
const toasts = computed(() => appStore.notifications)

// Remove toast handler
const removeToast = (id: string) => {
  appStore.removeNotification(id)
}
</script>
