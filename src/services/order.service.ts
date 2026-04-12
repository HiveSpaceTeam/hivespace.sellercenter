import { apiService } from './api'
import { buildApiUrl } from '@/config'
import { OrderTabStatus, OrderType } from '@/types'
import type {
  Order,
  SellerOrderApi,
  SellerOrderListResponse,
  SellerOrderQuery,
} from '@/types'

// Maps frontend OrderTabStatus string → backend SellerOrderProcessStatus integer
const PROCESS_STATUS_MAP: Partial<Record<OrderTabStatus, number>> = {
  [OrderTabStatus.PendingConfirmation]: 1,
  [OrderTabStatus.ReadyToShip]: 2,
  [OrderTabStatus.Shipping]: 3,
  [OrderTabStatus.Delivered]: 4,
  [OrderTabStatus.ReturnCancel]: 5,
}

const ORDER_ENDPOINTS = {
  SELLER: '/orders/seller',
  CONFIRM: (id: string) => `/orders/${id}/confirm`,
  REJECT: (id: string) => `/orders/${id}/reject`,
} as const

const STATUS_LABEL: Record<string, string> = {
  [OrderTabStatus.PendingConfirmation]: 'Chờ xác nhận',
  [OrderTabStatus.ReadyToShip]: 'Chờ lấy hàng',
  [OrderTabStatus.Shipping]: 'Đang giao',
  [OrderTabStatus.Delivered]: 'Đã giao',
  [OrderTabStatus.ReturnCancel]: 'Trả/Huỷ',
}

const mapApiOrder = (api: SellerOrderApi): Order => ({
  id: api.id,
  orderCode: api.orderCode,
  customerName: api.buyerName,
  totalAmount: api.totalAmount,
  paymentNote: api.paymentMethod,
  status: (api.status as OrderTabStatus) ?? OrderTabStatus.PendingConfirmation,
  statusLabel: STATUS_LABEL[api.status] ?? api.status,
  orderType: OrderType.Normal,
  shippingUnit: { name: '', provider: '', method: '' },
  deadlineNote: api.actionDateTime
    ? new Date(api.actionDateTime).toLocaleString('vi-VN')
    : undefined,
  isProcessed: [OrderTabStatus.Delivered, OrderTabStatus.ReturnCancel].includes(
    api.status as OrderTabStatus,
  ),
  createdAt: api.createdAt,
  items: api.items.map((item) => ({
    id: item.id,
    productName: item.productName,
    productImage: item.productImageUrl,
    variation: item.variation,
    quantity: item.quantity,
    tag: item.tag || undefined,
  })),
})

class OrderService {
  async getOrders(query: SellerOrderQuery): Promise<SellerOrderListResponse & { mapped: Order[] }> {
    const url = buildApiUrl(ORDER_ENDPOINTS.SELLER)
    const numericStatus = PROCESS_STATUS_MAP[query.processStatus as OrderTabStatus]
    const params: Record<string, string | number> = {
      page: query.page,
      pageSize: query.pageSize,
    }
    if (query.searchField) params.searchField = query.searchField
    if (query.searchValue) params.searchValue = query.searchValue
    if (numericStatus !== undefined) params.processStatus = numericStatus
    const response = await apiService.get<SellerOrderListResponse>(url, { params })
    return {
      ...response,
      mapped: response.orders.map(mapApiOrder),
    }
  }

  async confirmOrder(orderId: string): Promise<void> {
    const url = buildApiUrl(ORDER_ENDPOINTS.CONFIRM(orderId))
    await apiService.post(url, {})
  }

  async rejectOrder(orderId: string, reason: string): Promise<void> {
    const url = buildApiUrl(ORDER_ENDPOINTS.REJECT(orderId))
    await apiService.post(url, { reason })
  }
}

export const orderService = new OrderService()
