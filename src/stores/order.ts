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
      const trimmedSearchValue = searchValue.value.trim()
      const hasSearch = trimmedSearchValue.length > 0
      const result = await orderService.getOrders({
        processStatus: activeTab.value,
        searchField: hasSearch ? searchField.value : undefined,
        searchValue: hasSearch ? trimmedSearchValue : undefined,
        page: page.value,
        pageSize: pageSize.value,
      })

      // Client-side secondary filters (orderType, processStatus, shipping not supported by API)
      let filtered = result.mapped

      if (orderTypeFilter.value !== OrderType.All) {
        filtered = filtered.filter((o) => o.orderType === orderTypeFilter.value)
      }
      if (processStatusFilter.value === OrderProcessStatus.Unprocessed) {
        filtered = filtered.filter((o) => !o.isProcessed)
      } else if (processStatusFilter.value === OrderProcessStatus.Processed) {
        filtered = filtered.filter((o) => o.isProcessed)
      }
      if (shippingFilter.value && shippingFilter.value !== 'all') {
        filtered = filtered.filter((o) =>
          o.shippingUnit.provider.toLowerCase().includes(shippingFilter.value.toLowerCase()),
        )
      }

      orders.value = filtered
      totalOrders.value = result.pagination.totalItems

      // Update count for the active tab using API total
      tabCounts.value = [
        OrderTabStatus.All,
        OrderTabStatus.PendingConfirmation,
        OrderTabStatus.ReadyToShip,
        OrderTabStatus.Shipping,
        OrderTabStatus.Delivered,
        OrderTabStatus.ReturnCancel,
      ].map((tab) => ({
        tab,
        count: tab === activeTab.value ? result.pagination.totalItems : 0,
      }))
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

  const cancelOrder = async (orderId: string, reason: string) => {
    const appStore = useAppStore()
    try {
      appStore.setLoading(true)
      await orderService.rejectOrder(orderId, reason)
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
