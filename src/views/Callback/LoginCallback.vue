<template>
  <div>
    <h1></h1>
  </div>
</template>
<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@hivespace/shared'

const router = useRouter()
const { handleLoginCallback, logout } = useAuth()

onMounted(async () => {
  try {
    const result = await handleLoginCallback()
    let returnToUrl = '/product/list'
    if (result && result.state) {
        // Checking if result.state is an object and has redirectTo or just a string?
        // oidc-client-ts user.state is any.
        // hivespace logic usually puts redirectTo in state.
        const state = result.state as any
        if (typeof state === 'string') {
             returnToUrl = state
        } else if (state?.redirectTo) {
             returnToUrl = state.redirectTo
        }
    }
    router.push({ path: returnToUrl })
  } catch (error) {
    // Handle error, e.g., redirect to error page or show message
    await logout()
    console.error('Callback error:', error)
  }
})
</script>
