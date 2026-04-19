import { createNotificationStore } from '@hivespace/shared'
import { notificationService } from '@/services/notification.service'
import i18n from '@/i18n'

const resolveLink = (eventType: string): string => {
  switch (eventType) {
    case 'seller.new_order': return '/orders/all'
    case 'inventory.low_stock': return '/product/list'
    default: return '/notifications'
  }
}

const resolveMessage = (eventType: string, payload: Record<string, unknown>): string => {
  const t = i18n.global.t
  switch (eventType) {
    case 'seller.new_order':
      return t('notification.events.newOrder', {
        orderCode: payload.orderCode ?? '',
        buyerName: payload.buyerName ?? '',
      })
    case 'inventory.low_stock':
      return t('notification.events.lowStock', {
        productName: payload.productName ?? '',
        remaining: payload.remaining ?? 0,
      })
    default:
      return t('notification.events.generic', { eventType })
  }
}

export const useNotificationStore = createNotificationStore({
  service: notificationService,
  resolveLink,
  resolveMessage,
})
