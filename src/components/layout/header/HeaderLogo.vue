<template>
  <router-link to="/demo" class="lg:hidden">
    <img class="dark:hidden" src="/images/logo/logo-light.svg" :alt="$t('common.menu')" />
    <img class="hidden dark:block" src="/images/logo/logo-dark.svg" :alt="$t('common.menu')" />
  </router-link>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>
