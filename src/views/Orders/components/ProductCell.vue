<template>
  <div class="flex items-start gap-3">
    <!-- Product thumbnail -->
    <div
      class="w-14 h-14 flex-shrink-0 rounded overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
    >
      <img
        v-if="item.productImage"
        :src="item.productImage"
        :alt="item.productName"
        class="w-full h-full object-cover"
      />
      <div
        v-else
        class="w-full h-full flex items-center justify-center"
      >
        <svg
          class="w-6 h-6 text-gray-300 dark:text-gray-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    </div>

    <!-- Product info -->
    <div class="flex-1 min-w-0">
      <Badge v-if="item.tag" size="sm" color="error" class="mb-0.5">
        {{ item.tag }}
      </Badge>
      <p class="text-sm text-gray-800 dark:text-gray-200 line-clamp-2 leading-snug">
        {{ item.productName }}
      </p>
      <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
        Variation: {{ item.variation }}
      </p>
    </div>

    <!-- Quantity -->
    <span class="text-sm text-gray-600 dark:text-gray-400 flex-shrink-0 ml-2">
      x{{ item.quantity }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { Badge } from '@hivespace/shared'
import type { OrderItem } from '@/types'

defineProps<{
  item: OrderItem
}>()
</script>
