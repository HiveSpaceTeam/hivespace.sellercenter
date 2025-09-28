<template>
  <div>
    <h1></h1>
  </div>
</template>
<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { handleLoginCallback, logout } from '@/auth/user-manager';

const router = useRouter();
onMounted(async () => {
  try {
    const result = await handleLoginCallback();
    const state = result?.state;
    const returnToUrl =
      typeof state === 'string' && state.startsWith('/') ? state : '/';
    router.push(returnToUrl);
  } catch (error) {
    // Handle error, e.g., redirect to error page or show message
    await logout();
    console.error('Callback error:', error);
  }
});
</script>
