<template>
  <div>
    <h1></h1>
  </div>
</template>
<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { numericToStringCulture, useAuth } from '@hivespace/shared'
import { useUserStore } from '@/stores/user';
import i18n from '@/i18n';

const router = useRouter()
const { handleLoginCallback, logout } = useAuth()

onMounted(async () => {
  try {
    const result = await handleLoginCallback()
    let returnToUrl = '/product/list'
    if (result.state !== undefined) {
      returnToUrl = result.url_state || returnToUrl;
    }
    const userStore = useUserStore();
    const settings = await userStore.fetchUserSettings();
    i18n.global.locale.value = numericToStringCulture(settings.culture);
    router.push({ path: returnToUrl });
  } catch (error) {
    // Handle error, e.g., redirect to error page or show message
    await logout()
    console.error('Callback error:', error)
  }
})
</script>