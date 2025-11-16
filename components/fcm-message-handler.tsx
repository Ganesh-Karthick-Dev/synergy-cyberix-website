"use client"

import { useEffect } from 'react'
import { messaging } from '@/lib/firebase/config'
import { onMessage } from 'firebase/messaging'

/**
 * FCM Message Handler Component
 * Handles foreground push notifications (when browser tab is open)
 * Background notifications are handled by the service worker
 */
export function FCMMessageHandler() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    if (!messaging) {
      console.warn('[FCM Message Handler] Messaging not initialized')
      return
    }

    // Handle foreground messages (when tab is open)
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('[FCM Message Handler] Received foreground message:', payload)

      // Show browser notification even when tab is open
      if ('Notification' in window && Notification.permission === 'granted') {
        const notificationTitle = payload.notification?.title || payload.data?.title || 'New Notification'
        const notificationOptions: NotificationOptions = {
          body: payload.notification?.body || payload.data?.body || '',
          icon: payload.notification?.icon || payload.data?.icon || '/favicon.ico',
          badge: '/favicon.ico',
          tag: payload.data?.notificationId || payload.messageId || 'default',
          data: payload.data || {},
          requireInteraction: false,
        }

        // Show notification
        new Notification(notificationTitle, notificationOptions)
      } else {
        // Fallback: show alert if notifications not permitted
        console.warn('[FCM Message Handler] Notification permission not granted, showing alert')
        const title = payload.notification?.title || payload.data?.title || 'New Notification'
        const body = payload.notification?.body || payload.data?.body || ''
        alert(`${title}\n\n${body}`)
      }
    })

    console.log('[FCM Message Handler] Foreground message handler registered')

    return () => {
      unsubscribe()
    }
  }, [])

  return null
}


