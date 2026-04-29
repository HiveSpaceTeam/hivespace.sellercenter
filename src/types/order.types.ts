export enum OrderTabStatus {
  All = 'all',
  PendingConfirmation = 'pending_confirmation',
  ReadyToShip = 'ready_to_ship',
  Shipping = 'shipping',
  Delivered = 'delivered',
  ReturnCancel = 'return_cancel',
}

export enum OrderType {
  All = 'all',
  Normal = 'normal',
  Express = 'express',
}

export enum OrderProcessStatus {
  All = 'all',
  Unprocessed = 'unprocessed',
  Processed = 'processed',
}

export interface OrderItem {
  id: string
  productName: string
  productImage: string
  variation: string
  quantity: number
  tag?: string
}

export interface ShippingUnit {
  name: string
  provider: string
  method: string
}

export interface Order {
  id: string
  orderCode: string
  customerName: string
  items: OrderItem[]
  totalAmount: number
  paymentNote: string
  status: OrderTabStatus
  statusLabel: string
  orderType: OrderType
  shippingUnit: ShippingUnit
  deadlineNote?: string
  isProcessed: boolean
  createdAt: string
}

export interface OrderFilter {
  tab: OrderTabStatus
  orderType: OrderType
  processStatus: OrderProcessStatus
  searchField: string
  searchValue: string
  shippingUnit: string
  page: number
  pageSize: number
}

export interface OrderTabCount {
  tab: OrderTabStatus
  count: number
}

// ── API response types ────────────────────────────────────
export interface SellerOrderItemApi {
  id: string
  productName: string
  productImageUrl: string
  variation: string
  quantity: number
  tag: string
}

export interface SellerOrderApi {
  id: string
  orderCode: string
  buyerName: string
  status: string
  paymentMethod: string
  totalAmount: number
  actionDateTime: string
  createdAt: string
  items: SellerOrderItemApi[]
}

export interface SellerOrderListResponse {
  orders: SellerOrderApi[]
  pagination: {
    currentPage: number
    pageSize: number
    totalItems: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

export interface SellerOrderQuery {
  processStatus: string
  searchField?: string
  searchValue?: string
  page: number
  pageSize: number
}
