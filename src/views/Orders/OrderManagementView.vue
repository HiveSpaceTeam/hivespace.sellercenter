<template>
  <DictionaryLayout>
    <PageBreadcrumb :pageTitle="$t('order.title')" />

    <div class="space-y-4">
      <!-- ── Header ─────────────────────────────────────────── -->
      <div class="flex items-center justify-between">
        <h1 class="text-xl font-semibold text-gray-900 dark:text-white">
          {{ $t('order.breadcrumb') }}
        </h1>
        <div class="flex items-center gap-2">
          <Button variant="outline" size="sm">{{ $t('order.actions.export') }}</Button>
          <Button variant="outline" size="sm">{{ $t('order.actions.exportHistory') }}</Button>
        </div>
      </div>

      <!-- ── Main Card ───────────────────────────────────────── -->
      <div
        class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3"
      >
        <!-- Tabs -->
        <div class="border-b border-gray-200 dark:border-gray-700 px-2 pt-1">
          <Tabs v-model="activeTab" :options="tabOptions" />
        </div>

        <!-- Order type + process status filters -->
        <div
          class="px-4 pt-4 pb-3 border-b border-gray-100 dark:border-gray-800 space-y-3"
        >
          <div class="flex items-center gap-4 flex-wrap">
            <span class="text-sm text-gray-500 min-w-[140px]">
              {{ $t('order.filters.orderType') }}
            </span>
            <FilterChips v-model="orderTypeFilter" :options="orderTypeOptions" />
          </div>
          <div class="flex items-center gap-4 flex-wrap">
            <span class="text-sm text-gray-500 min-w-[140px]">
              {{ $t('order.filters.processStatus') }}
            </span>
            <FilterChips v-model="processStatusFilter" :options="processStatusOptions" />
          </div>
        </div>

        <!-- Search / shipping filter bar -->
        <div class="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
          <div class="flex flex-wrap items-center gap-3">
            <!-- Search field selector + input -->
            <div class="flex items-center gap-2 min-w-[320px]">
              <div class="min-w-[160px]">
                <Select v-model="searchField" :options="searchFieldOptions" />
              </div>
              <input
                v-model="searchValue"
                type="text"
                :placeholder="searchPlaceholder"
                class="flex-1 h-11 px-3 text-sm text-gray-800 bg-white dark:bg-gray-900 dark:text-gray-300 border border-gray-300 dark:border-gray-700 rounded-lg outline-none focus:border-brand-300 focus:ring-2 focus:ring-brand-500/10"
                @keyup.enter="handleApply"
              />
            </div>

            <!-- Shipping filter -->
            <div class="flex items-center gap-2 min-w-[240px]">
              <span class="text-sm text-gray-500 whitespace-nowrap">
                {{ $t('order.search.shippingUnit') }}
              </span>
              <div class="flex-1">
                <Select
                  v-model="shippingFilter"
                  :options="shippingOptions"
                  :placeholder="$t('order.search.allShipping')"
                />
              </div>
            </div>

            <!-- Apply / Reset -->
            <div class="flex items-center gap-2">
              <Button variant="primary" size="sm" @click="handleApply">
                {{ $t('order.search.apply') }}
              </Button>
              <Button variant="outline" size="sm" @click="handleReset">
                {{ $t('order.search.reset') }}
              </Button>
            </div>
          </div>
        </div>

        <!-- Loading -->
        <div v-if="orderStore.isFetching" class="p-12 text-center">
          <div
            class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"
          ></div>
        </div>

        <template v-else>
          <!-- Count + sort + bulk ship -->
          <div class="px-4 py-3 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ $t('order.itemCount', { count: orderStore.totalOrders }) }}
            </span>
            <div class="flex items-center gap-3">
              <div class="flex items-center gap-1 text-sm text-gray-500">
                <ArrowDownRedIcon class="w-4 h-4" />
                <span>{{ $t('order.sort.label') }}</span>
              </div>
              <Button
                v-if="activeTab === OrderTabStatus.ReadyToShip || activeTab === OrderTabStatus.All"
                variant="primary"
                size="sm"
                :startIcon="ListIcon"
              >
                {{ $t('order.actions.bulkShip') }}
              </Button>
            </div>
          </div>

          <!-- Table -->
          <div class="overflow-x-auto custom-scrollbar">
            <table class="min-w-full">
              <thead>
                <tr class="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                  <th class="px-4 py-3 text-left w-[420px]">
                    <p class="font-medium text-gray-500 text-theme-xs">
                      {{ $t('order.table.product') }}
                    </p>
                  </th>
                  <th class="px-4 py-3 text-right w-[160px]">
                    <p class="font-medium text-gray-500 text-theme-xs">
                      {{ $t('order.table.totalAmount') }}
                    </p>
                  </th>
                  <th class="px-4 py-3 text-left w-[130px]">
                    <p class="font-medium text-gray-500 text-theme-xs">
                      {{ $t('order.table.status') }}
                    </p>
                  </th>
                  <th class="px-4 py-3 text-left w-[180px]">
                    <p class="font-medium text-gray-500 text-theme-xs flex items-center gap-1">
                      {{ $t('order.table.countdown') }}
                      <span class="inline-flex items-center justify-center w-4 h-4 rounded-full border border-gray-400 text-[10px] text-gray-400 cursor-help">?</span>
                    </p>
                  </th>
                  <th class="px-4 py-3 text-left w-[150px]">
                    <p class="font-medium text-gray-500 text-theme-xs">
                      {{ $t('order.table.shippingUnit') }}
                    </p>
                  </th>
                  <th class="px-4 py-3 text-left w-[140px]">
                    <p class="font-medium text-gray-500 text-theme-xs">
                      {{ $t('order.table.actions') }}
                    </p>
                  </th>
                </tr>
              </thead>

              <!-- Empty state -->
              <tbody v-if="orderStore.orders.length === 0">
                <tr>
                  <td colspan="6" class="px-4 py-16 text-center text-gray-500">
                    <p class="text-sm font-medium">{{ $t('order.table.emptyText') }}</p>
                  </td>
                </tr>
              </tbody>

              <!-- Order groups -->
              <tbody
                v-for="order in orderStore.orders"
                :key="order.id"
                class="border-b border-gray-200 dark:border-gray-700"
              >
                <!-- Group header row -->
                <tr class="bg-gray-50/70 dark:bg-gray-800/30">
                  <td colspan="6" class="px-4 py-2">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <Avatar :name="order.customerName" size="sm" />
                        <span class="text-sm font-medium text-gray-700 dark:text-gray-200">
                          {{ order.customerName }}
                        </span>
                        <MailIcon class="w-4 h-4 text-gray-400" />
                        <Badge
                          v-if="order.orderType === OrderType.Express"
                          size="sm"
                          color="error"
                        >
                          Hoả Tốc
                        </Badge>
                      </div>
                      <span class="text-sm text-gray-500">
                        {{ $t('order.orderCode') }} {{ order.orderCode }}
                      </span>
                    </div>
                  </td>
                </tr>

                <!-- First product row (with rowspan for right columns) -->
                <tr
                  v-if="order.items.length > 0"
                  class="hover:bg-gray-50/50 dark:hover:bg-gray-800/20"
                >
                  <td class="px-4 py-3">
                    <ProductCell :item="order.items[0]" />
                  </td>
                  <td
                    :rowspan="order.items.length"
                    class="px-4 py-3 align-top text-right"
                  >
                    <p class="text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">
                      đ{{ formatMoney(order.totalAmount) }}
                    </p>
                    <p class="text-xs text-gray-500 mt-0.5">{{ order.paymentNote }}</p>
                  </td>
                  <td :rowspan="order.items.length" class="px-4 py-3 align-top">
                    <p class="text-sm text-gray-700 dark:text-gray-300">{{ order.statusLabel }}</p>
                  </td>
                  <td
                    :rowspan="order.items.length"
                    class="px-4 py-3 align-top text-xs text-gray-500 dark:text-gray-400 max-w-[180px]"
                  >
                    {{ order.deadlineNote }}
                  </td>
                  <td :rowspan="order.items.length" class="px-4 py-3 align-top">
                    <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {{ order.shippingUnit.name }}
                    </p>
                    <p class="text-xs text-gray-500">{{ order.shippingUnit.provider }}</p>
                    <p class="text-xs text-gray-500">{{ order.shippingUnit.method }}</p>
                  </td>
                  <td :rowspan="order.items.length" class="px-4 py-3 align-top">
                    <!-- Chờ xác nhận: confirm + cancel -->
                    <div
                      v-if="activeTab === OrderTabStatus.PendingConfirmation"
                      class="flex flex-col gap-2"
                    >
                      <Button
                        variant="primary"
                        size="sm"
                        @click="handleConfirm(order.id)"
                      >
                        {{ $t('order.actions.confirm') }}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        @click="handleCancel(order.id)"
                      >
                        {{ $t('order.actions.cancel') }}
                      </Button>
                    </div>
                    <!-- Chờ lấy hàng: chuẩn bị hàng -->
                    <button
                      v-else-if="activeTab === OrderTabStatus.ReadyToShip"
                      class="text-sm text-brand-500 hover:underline font-medium"
                      @click="handlePrepare(order.id)"
                    >
                      {{ $t('order.actions.prepareGoods') }}
                    </button>
                    <!-- Other tabs: view detail -->
                    <button
                      v-else
                      class="text-sm text-brand-500 hover:underline"
                    >
                      {{ $t('order.actions.viewDetail') }}
                    </button>
                  </td>
                </tr>

                <!-- Subsequent product rows -->
                <tr
                  v-for="item in order.items.slice(1)"
                  :key="item.id"
                  class="hover:bg-gray-50/50 dark:hover:bg-gray-800/20"
                >
                  <td class="px-4 py-3 border-t border-gray-100 dark:border-gray-800">
                    <ProductCell :item="item" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div
            v-if="orderStore.totalOrders > orderStore.pageSize"
            class="px-4 py-4 border-t border-gray-200 dark:border-gray-700"
          >
            <Pagination
              :currentPage="orderStore.page"
              :totalPages="orderStore.totalPages"
              :pageSize="orderStore.pageSize"
              :totalItems="orderStore.totalOrders"
              @update:currentPage="handlePageChange"
              @update:pageSize="handlePageSizeChange"
            />
          </div>
        </template>
      </div>
    </div>
  </DictionaryLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import DictionaryLayout from '@/components/layout/DictionaryLayout.vue'
import {
  PageBreadcrumb,
  Button,
  Tabs,
  Badge,
  Select,
  Pagination,
  Avatar,
  FilterChips,
} from '@hivespace/shared'
import { MailIcon, ArrowDownRedIcon, ListIcon } from '@/icons'
import { OrderTabStatus, OrderType, OrderProcessStatus } from '@/types'
import type { Order } from '@/types'
import { useOrderStore } from '@/stores/order'
import { useConfirmModal } from '@hivespace/shared'
import ProductCell from './components/ProductCell.vue'

const { t } = useI18n()
const orderStore = useOrderStore()
const { confirm, deleteConfirm } = useConfirmModal()

// ── Local state (two-way bound to store) ──────────────────
const activeTab = computed({
  get: () => orderStore.activeTab,
  set: (val) => orderStore.setTab(val),
})

const orderTypeFilter = computed({
  get: () => orderStore.orderTypeFilter,
  set: (val) => (orderStore.orderTypeFilter = val),
})

const processStatusFilter = computed({
  get: () => orderStore.processStatusFilter,
  set: (val) => (orderStore.processStatusFilter = val),
})

const searchField = computed({
  get: () => orderStore.searchField,
  set: (val) => (orderStore.searchField = val),
})

const searchValue = computed({
  get: () => orderStore.searchValue,
  set: (val) => (orderStore.searchValue = val),
})

const shippingFilter = computed({
  get: () => orderStore.shippingFilter,
  set: (val) => (orderStore.shippingFilter = val),
})

// ── Tab options ───────────────────────────────────────────
const tabOptions = computed(() => [
  {
    label: `${t('order.tabs.all')}`,
    value: OrderTabStatus.All,
  },
  {
    label: `${t('order.tabs.pendingConfirmation')} (${orderStore.getTabCount(OrderTabStatus.PendingConfirmation)})`,
    value: OrderTabStatus.PendingConfirmation,
  },
  {
    label: `${t('order.tabs.readyToShip')} (${orderStore.getTabCount(OrderTabStatus.ReadyToShip)})`,
    value: OrderTabStatus.ReadyToShip,
  },
  {
    label: `${t('order.tabs.shipping')} (${orderStore.getTabCount(OrderTabStatus.Shipping)})`,
    value: OrderTabStatus.Shipping,
  },
  {
    label: t('order.tabs.delivered'),
    value: OrderTabStatus.Delivered,
  },
  {
    label: `${t('order.tabs.returnCancel')} (${orderStore.getTabCount(OrderTabStatus.ReturnCancel)})`,
    value: OrderTabStatus.ReturnCancel,
  },
])

// ── Filter options ────────────────────────────────────────
const orderTypeOptions = computed(() => {
  const normalCount = orderStore.tabCounts
    .filter(() => true)
    .reduce(
      (acc) => acc,
      orderStore.orders.filter((o: Order) => o.orderType === OrderType.Normal).length,
    )
  const expressCount = orderStore.orders.filter(
    (o: Order) => o.orderType === OrderType.Express,
  ).length
  return [
    { label: t('order.filters.all'), value: OrderType.All },
    {
      label: `${t('order.filters.normalOrder')} (${normalCount})`,
      value: OrderType.Normal,
    },
    {
      label: `${t('order.filters.expressOrder')} (${expressCount})`,
      value: OrderType.Express,
    },
  ]
})

const processStatusOptions = computed(() => {
  const unprocessedCount = orderStore.orders.filter((o: Order) => !o.isProcessed).length
  const processedCount = orderStore.orders.filter((o: Order) => o.isProcessed).length
  return [
    { label: t('order.filters.all'), value: OrderProcessStatus.All },
    {
      label: `${t('order.filters.unprocessed')} (${unprocessedCount})`,
      value: OrderProcessStatus.Unprocessed,
    },
    {
      label: `${t('order.filters.processed')} (${processedCount})`,
      value: OrderProcessStatus.Processed,
    },
  ]
})

const shippingOptions = computed(() => [
  { label: t('order.search.allShipping'), value: 'all' },
  { label: 'SPX Express', value: 'SPX Express' },
  { label: 'J&T Express', value: 'J&T' },
  { label: 'GHTK', value: 'GHTK' },
  { label: 'ViettelPost', value: 'ViettelPost' },
  { label: 'GrabExpress', value: 'GrabExpress' },
])

const searchFieldOptions = computed(() => [
  { label: t('order.search.fieldOrderCode'), value: 'orderCode' },
  { label: t('order.search.fieldCustomerName'), value: 'customerName' },
  { label: t('order.search.fieldProduct'), value: 'product' },
])

const searchPlaceholder = computed(() => {
  const found = searchFieldOptions.value.find((o) => o.value === searchField.value)
  return found ? t('order.search.placeholder', { field: found.label }) : ''
})

// ── Handlers ─────────────────────────────────────────────
const handleApply = () => {
  orderStore.applyFilters()
}

const handleReset = () => {
  orderStore.resetFilters()
}

const handlePageChange = (newPage: number) => {
  orderStore.page = newPage
  orderStore.fetchOrders()
}

const handlePageSizeChange = (size: number) => {
  orderStore.pageSize = size
  orderStore.page = 1
  orderStore.fetchOrders()
}

const handleConfirm = async (orderId: string) => {
  const confirmed = await confirm(
    t('order.actions.confirm'),
    t('order.notifications.confirmSuccess.message'),
  )
  if (confirmed) {
    await orderStore.confirmOrder(orderId)
  }
}

const handleCancel = async (orderId: string) => {
  const confirmed = await deleteConfirm(
    t('order.actions.cancel'),
    'Bạn có chắc muốn huỷ đơn hàng này không?',
  )
  if (confirmed) {
    await orderStore.cancelOrder(orderId)
  }
}

const handlePrepare = (orderId: string) => {
  console.log('Prepare goods for order:', orderId)
}

// ── Helpers ───────────────────────────────────────────────
const formatMoney = (amount: number) => amount.toLocaleString('vi-VN')

// ── Lifecycle ─────────────────────────────────────────────
onMounted(() => {
  orderStore.fetchOrders()
})

watch([orderTypeFilter, processStatusFilter], () => {
  orderStore.applyFilters()
})
</script>
