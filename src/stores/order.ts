import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import i18n from '@/i18n'
import { useAppStore } from '@hivespace/shared'
import { OrderTabStatus, OrderType, OrderProcessStatus } from '@/types'
import type { Order, OrderTabCount } from '@/types'
import { orderService } from '@/services/order.service'

export const useOrderStore = defineStore('order', () => {
  // ── State ──────────────────────────────────────────────────
  const orders = ref<Order[]>([])
  const totalOrders = ref(0)
  const tabCounts = ref<OrderTabCount[]>([])
  const isFetching = ref(false)

  const activeTab = ref<string>(OrderTabStatus.All)
  const orderTypeFilter = ref<string>(OrderType.All)
  const processStatusFilter = ref<string>(OrderProcessStatus.All)
  const searchField = ref<string>('orderCode')
  const searchValue = ref<string>('')
  const shippingFilter = ref<string>('all')
  const page = ref(1)
  const pageSize = ref(10)

  // ── Computed ───────────────────────────────────────────────
  const totalPages = computed(() => Math.max(1, Math.ceil(totalOrders.value / pageSize.value)))

  // ── Actions ───────────────────────────────────────────────

  const fetchOrders = async () => {
    isFetching.value = true
    try {
      const result = orderService.getOrders({
        tab: activeTab.value as OrderTabStatus,
        orderType: orderTypeFilter.value as OrderType,
        processStatus: processStatusFilter.value as OrderProcessStatus,
        searchField: searchField.value,
        searchValue: searchValue.value,
        shippingUnit: shippingFilter.value,
        page: page.value,
        pageSize: pageSize.value,
      })
      orders.value = result.orders
      totalOrders.value = result.total
      tabCounts.value = orderService.getTabCounts()
    } finally {
      isFetching.value = false
    }
  }

  const applyFilters = async () => {
    page.value = 1
    await fetchOrders()
  }

  const resetFilters = async () => {
    orderTypeFilter.value = OrderType.All
    processStatusFilter.value = OrderProcessStatus.All
    searchValue.value = ''
    shippingFilter.value = 'all'
    searchField.value = 'orderCode'
    page.value = 1
    await fetchOrders()
  }

  const setTab = async (tab: string) => {
    activeTab.value = tab
    orderTypeFilter.value = OrderType.All
    processStatusFilter.value = OrderProcessStatus.All
    page.value = 1
    await fetchOrders()
  }

  const confirmOrder = async (orderId: string) => {
    const appStore = useAppStore()
    try {
      appStore.setLoading(true)
      await orderService.confirmOrder(orderId)
      appStore.notifySuccess(
        i18n.global.t('order.notifications.confirmSuccess.title'),
        i18n.global.t('order.notifications.confirmSuccess.message'),
      )
      await fetchOrders()
    } finally {
      appStore.setLoading(false)
    }
  }

  const cancelOrder = async (orderId: string) => {
    const appStore = useAppStore()
    try {
      appStore.setLoading(true)
      await orderService.cancelOrder(orderId)
      appStore.notifySuccess(
        i18n.global.t('order.notifications.cancelSuccess.title'),
        i18n.global.t('order.notifications.cancelSuccess.message'),
      )
      await fetchOrders()
    } finally {
      appStore.setLoading(false)
    }
  }

  const getTabCount = (tab: OrderTabStatus) => {
    return tabCounts.value.find((tc) => tc.tab === tab)?.count ?? 0
  }

  return {
    // state
    orders,
    totalOrders,
    tabCounts,
    isFetching,
    activeTab,
    orderTypeFilter,
    processStatusFilter,
    searchField,
    searchValue,
    shippingFilter,
    page,
    pageSize,
    totalPages,
    // actions
    fetchOrders,
    applyFilters,
    resetFilters,
    setTab,
    confirmOrder,
    cancelOrder,
    getTabCount,
  }
})
