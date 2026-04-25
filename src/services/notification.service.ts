import { apiService } from './api'
import { buildApiUrl } from '@/config'
import type { INotificationService, NotificationListResponse } from '@hivespace/shared'

const ENDPOINTS = {
  LIST: '/notifications',
  UNREAD_COUNT: '/notifications/unread-count',
  MARK_READ: (id: string) => `/notifications/${id}/read`,
} as const

class NotificationService implements INotificationService {
  getNotifications(page = 1, pageSize = 20, unreadOnly = false): Promise<NotificationListResponse> {
    return apiService.get<NotificationListResponse>(buildApiUrl(ENDPOINTS.LIST), {
      params: { page, pageSize, unreadOnly },
    })
  }

  async getUnreadCount(): Promise<number> {
    const res = await apiService.get<{ count: number }>(buildApiUrl(ENDPOINTS.UNREAD_COUNT))
    return res.count
  }

  markAsRead(id: string): Promise<void> {
    return apiService.put(buildApiUrl(ENDPOINTS.MARK_READ(id)), {})
  }
}

export const notificationService = new NotificationService()
