"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useUserNotifications, useMarkNotificationAsRead, useMarkAllNotificationsAsRead } from "@/hooks/use-user-notifications"
import { Bell, Check, CheckCheck, Loader2, Image as ImageIcon } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

const getNotificationTypeColor = (type: string) => {
  switch (type) {
    case 'SECURITY_ALERT':
      return 'text-red-400'
    case 'SYSTEM_UPDATE':
      return 'text-blue-400'
    case 'FEATURE_ANNOUNCEMENT':
      return 'text-green-400'
    case 'PROMOTIONAL':
      return 'text-orange-400'
    case 'BILLING_REMINDER':
      return 'text-yellow-400'
    default:
      return 'text-gray-400'
  }
}

const getNotificationTypeLabel = (type: string) => {
  switch (type) {
    case 'SECURITY_ALERT':
      return 'Security Alert'
    case 'SYSTEM_UPDATE':
      return 'System Update'
    case 'FEATURE_ANNOUNCEMENT':
      return 'Feature Announcement'
    case 'PROMOTIONAL':
      return 'Promotional'
    case 'BILLING_REMINDER':
      return 'Billing Reminder'
    case 'MAINTENANCE_NOTICE':
      return 'Maintenance Notice'
    default:
      return 'General'
  }
}

export function NotificationsTab() {
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const { data, isLoading, error } = useUserNotifications({
    page: 1,
    limit: 50,
    unreadOnly: filter === 'unread',
  })
  const markAsRead = useMarkNotificationAsRead()
  const markAllAsRead = useMarkAllNotificationsAsRead()

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markAsRead.mutateAsync(notificationId)
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead.mutateAsync()
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error)
    }
  }

  const notifications = data?.notifications || []
  const unreadCount = data?.unreadCount || 0

  return (
    <Card className="bg-gradient-to-br from-[#1a1a1a] via-[#1f1f1f] to-[#1a1a1a] border border-orange-500/20 shadow-xl shadow-orange-500/5 hover:shadow-orange-500/10 transition-all duration-300 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500/50 via-orange-500 to-orange-500/50"></div>
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between mb-2">
          <CardTitle className="text-2xl font-bold text-white flex items-center gap-3" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '700' }}>
            <div className="w-1.5 h-7 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full shadow-sm shadow-orange-500/50"></div>
            Notifications
            {unreadCount > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-orange-500 text-white text-sm rounded-full">
                {unreadCount}
              </span>
            )}
          </CardTitle>
          {unreadCount > 0 && (
            <Button
              onClick={handleMarkAllAsRead}
              disabled={markAllAsRead.isPending}
              variant="outline"
              size="sm"
              className="border-orange-500/50 text-orange-400 hover:bg-orange-500/10"
            >
              {markAllAsRead.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <CheckCheck className="w-4 h-4 mr-2" />
              )}
              Mark all as read
            </Button>
          )}
        </div>
        <CardDescription className="text-gray-400 text-base">
          View and manage your notifications
        </CardDescription>
        <div className="flex gap-2 mt-4">
          <Button
            onClick={() => setFilter('all')}
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            className={filter === 'all' ? 'bg-orange-500 hover:bg-orange-600' : 'border-gray-600'}
          >
            All
          </Button>
          <Button
            onClick={() => setFilter('unread')}
            variant={filter === 'unread' ? 'default' : 'outline'}
            size="sm"
            className={filter === 'unread' ? 'bg-orange-500 hover:bg-orange-600' : 'border-gray-600'}
          >
            Unread {unreadCount > 0 && `(${unreadCount})`}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-400">
            Failed to load notifications. Please try again.
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-16 h-16 mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400 text-lg">No notifications yet</p>
            <p className="text-gray-500 text-sm mt-2">
              {filter === 'unread' ? 'You have no unread notifications' : 'You\'ll see notifications here when they arrive'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-5 rounded-xl border transition-all duration-300 group cursor-pointer ${
                  notification.isRead
                    ? 'bg-[#2a2a2a]/40 border-gray-700/50 hover:border-gray-600'
                    : 'bg-[#2a2a2a]/80 border-orange-500/30 hover:border-orange-500/50'
                }`}
                onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
              >
                <div className="flex items-start gap-4">
                  {notification.imageUrl ? (
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-gray-700">
                      <img
                        src={notification.imageUrl}
                        alt={notification.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    </div>
                  ) : (
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500/20 to-orange-600/20 flex items-center justify-center">
                      <Bell className={`w-6 h-6 ${getNotificationTypeColor(notification.type)}`} />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4
                            className={`font-semibold text-white group-hover:text-orange-100 transition-colors ${
                              !notification.isRead ? 'font-bold' : ''
                            }`}
                            style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: notification.isRead ? '500' : '600' }}
                          >
                            {notification.title}
                          </h4>
                          <span className={`text-xs px-2 py-0.5 rounded ${getNotificationTypeColor(notification.type)} bg-opacity-20`}>
                            {getNotificationTypeLabel(notification.type)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 mb-2 line-clamp-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span>
                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                          </span>
                          {!notification.isRead && (
                            <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 rounded">
                              New
                            </span>
                          )}
                        </div>
                      </div>
                      {!notification.isRead && (
                        <Button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleMarkAsRead(notification.id)
                          }}
                          disabled={markAsRead.isPending}
                          variant="ghost"
                          size="sm"
                          className="flex-shrink-0 text-orange-400 hover:text-orange-300 hover:bg-orange-500/10"
                        >
                          {markAsRead.isPending ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Check className="w-4 h-4" />
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
