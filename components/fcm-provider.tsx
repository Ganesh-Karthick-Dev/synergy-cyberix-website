"use client"

import { useEffect } from 'react'
import { registerServiceWorker } from '@/lib/firebase/service-worker'

/**
 * FCM Provider Component
 * Registers the service worker for Firebase Cloud Messaging
 * This should be included in the app layout
 */
export function FCMProvider() {
  useEffect(() => {
    console.log('🔵 [FCM Provider] Component mounted, starting service worker registration...')
    
    // Check if service workers are supported
    if (typeof window === 'undefined') {
      console.warn('[FCM Provider] Window is undefined, skipping service worker registration')
      return
    }

    if (!('serviceWorker' in navigator)) {
      console.error('[FCM Provider] ❌ Service workers are not supported in this browser')
      return
    }

    console.log('[FCM Provider] ✅ Service workers are supported')
    
    // Check if service worker file is accessible
    fetch('/firebase-messaging-sw.js')
      .then((response) => {
        if (response.ok) {
          console.log('[FCM Provider] ✅ Service worker file is accessible')
        } else {
          console.error('[FCM Provider] ❌ Service worker file not found (status:', response.status, ')')
        }
      })
      .catch((error) => {
        console.error('[FCM Provider] ❌ Error checking service worker file:', error)
      })

    // Register service worker on mount
    registerServiceWorker()
      .then((registration) => {
        if (registration) {
          console.log('[FCM Provider] ✅ Service worker registration completed')
          console.log('[FCM Provider] Registration details:', {
            scope: registration.scope,
            active: !!registration.active,
            installing: !!registration.installing,
            waiting: !!registration.waiting,
          })
        } else {
          console.warn('[FCM Provider] ⚠️ Service worker registration returned null')
        }
      })
      .catch((error) => {
        console.error('[FCM Provider] ❌ Failed to register service worker:', error)
        console.error('[FCM Provider] Error details:', {
          message: error?.message,
          stack: error?.stack,
        })
      })
  }, [])

  return null
}


