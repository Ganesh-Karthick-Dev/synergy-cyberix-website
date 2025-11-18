import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  type UserNotificationsResponse,
} from '@/lib/api/notifications'

const NOTIFICATIONS_QUERY_KEY = ['userNotifications']

/**
 * Hook to fetch user notifications
 */
export function useUserNotifications(params?: {
  page?: number
  limit?: number
  unreadOnly?: boolean
}) {
  return useQuery<UserNotificationsResponse>({
    queryKey: [...NOTIFICATIONS_QUERY_KEY, params],
    queryFn: () => getUserNotifications(params),
    staleTime: 30 * 1000, // 30 seconds
    refetchOnWindowFocus: true,
  })
}

/**
 * Hook to mark a notification as read
 */
export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      // Invalidate notifications to refetch
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY })
    },
  })
}

/**
 * Hook to mark all notifications as read
 */
export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      // Invalidate notifications to refetch
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY })
    },
  })
}



