<template>
  <DictionaryLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="space-y-5 sm:space-y-6">
      <ComponentCard title="Bar Chart 1">
        <BarChartOne />
      </ComponentCard>
    </div>
  </DictionaryLayout>
</template>

<script setup>
import { ComponentCard, PageBreadcrumb, BarChartOne } from '@hivespace/shared';
import DictionaryLayout from '@/components/layout/DictionaryLayout.vue';
import { ref } from 'vue';
const currentPageTitle = ref('Bar Chart');
</script>
