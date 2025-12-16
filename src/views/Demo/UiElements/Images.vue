<template>
  <DictionaryLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="space-y-5 sm:space-y-6">
      <ComponentCard title="Responsive Image">
        <ResponsiveImage src="/images/cards/card-01.jpg" alt="Sample image" />
      </ComponentCard>
    </div>
  </DictionaryLayout>
</template>

<script setup>
import { ref } from 'vue'
import { PageBreadcrumb, ComponentCard, ResponsiveImage } from '@hivespace/shared'
import DictionaryLayout from '@/components/layout/DictionaryLayout.vue'
const currentPageTitle = ref('Images')
</script>

<style></style>
