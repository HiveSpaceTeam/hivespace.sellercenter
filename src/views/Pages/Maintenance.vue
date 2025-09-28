<template>
  <div class="relative flex flex-col items-center justify-center min-h-screen p-6 overflow-hidden z-1">
    <div>
      <div class="absolute right-0 top-0 -z-1 w-full max-w-[250px] xl:max-w-[450px]"><img
          src="/images/shape/grid-01.svg" alt="grid"></div>
      <div class="absolute bottom-0 left-0 -z-1 w-full max-w-[250px] rotate-180 xl:max-w-[450px]"><img
          src="/images/shape/grid-01.svg" alt="grid"></div>
    </div>
    <div>
      <div class="mx-auto w-full max-w-[274px] text-center sm:max-w-[555px]">
        <div class="mx-auto mb-10 w-full max-w-[155px] text-center sm:max-w-[204px]">
          <img src="/images/error/maintenance.svg" alt="maintenance" class="dark:hidden">
          <img src="/images/error/maintenance-dark.svg" alt="maintenance" class="hidden dark:block">
        </div>
        <h1 class="mb-2 font-bold text-gray-800 text-title-md dark:text-white/90 xl:text-title-2xl"> MAINTENANCE </h1>
        <p class="mt-6 mb-6 text-base text-gray-700 dark:text-gray-400 sm:text-lg"> Our Site is Currently under
          maintenance We will be back Shortly Thank You For Patience </p>
        <a href="/"
          class="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-3.5 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
          Back to Home Page </a>
      </div>
      <p class="absolute text-sm text-center text-gray-500 -translate-x-1/2 bottom-6 left-1/2 dark:text-gray-400"> ©
        2025 - HiveSpace </p>
    </div>
  </div>
</template>

<script setup lang="ts">
// Presentational maintenance page — no script logic required
</script>

<style scoped>
/* keep empty — styling handled by Tailwind classes */
</style>
