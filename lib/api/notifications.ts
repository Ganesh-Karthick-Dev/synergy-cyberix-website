/**
 * Notifications API Service
 */

import apiClient from './client'
import type { ApiResponse } from './types'

export interface UserNotification {
  id: string
  title: string
  message: string
  type: string
  imageUrl?: string | null
  data?: any
  isRead: boolean
  readAt?: string | null
  createdAt: string
}

export interface UserNotificationsResponse {
  notifications: UserNotification[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  unreadCount: number
}

/**
 * Get user notifications
 */
export const getUserNotifications = async (params?: {
  page?: number
  limit?: number
  unreadOnly?: boolean
}): Promise<UserNotificationsResponse> => {
  const queryParams = new URLSearchParams()
  if (params?.page) queryParams.append('page', params.page.toString())
  if (params?.limit) queryParams.append('limit', params.limit.toString())
  if (params?.unreadOnly) queryParams.append('unreadOnly', 'true')

  const response = await fetch(
    `/api/notifications/user/notifications?${queryParams.toString()}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      cache: 'no-store',
    }
  )

  if (!response.ok) {
    throw new Error(`Failed to fetch notifications: ${response.statusText}`)
  }

  const data: ApiResponse<UserNotificationsResponse> = await response.json()
  return data.data!
}

/**
 * Mark notification as read
 */
export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  const response = await fetch(`/api/notifications/user/notifications/${notificationId}/read`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error(`Failed to mark notification as read: ${response.statusText}`)
  }
}

/**
 * Mark all notifications as read
 */
export const markAllNotificationsAsRead = async (): Promise<{ updatedCount: number }> => {
  const response = await fetch('/api/notifications/user/notifications/read-all', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error(`Failed to mark all notifications as read: ${response.statusText}`)
  }

  const data: ApiResponse<{ updatedCount: number }> = await response.json()
  return data.data!
}

