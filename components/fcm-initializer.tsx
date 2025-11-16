"use client"

import { useEffect, useRef } from 'react'
import { isAuthenticated } from '@/lib/api/auth'
import { initializeFCM } from '@/lib/firebase/fcm'
import Cookies from 'js-cookie'

/**
 * FCM Initializer Component
 * Initializes FCM token when user is authenticated
 * This handles both regular login and Google OAuth login
 */
export function FCMInitializer() {
  const initializedRef = useRef(false)
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const checkAndInitialize = () => {
      // Check if user is authenticated
      const isAuth = isAuthenticated() || Cookies.get('isAuthenticated') === 'true'
      
      if (isAuth && !initializedRef.current) {
        // Check if FCM token is already stored
        const storedToken = typeof window !== 'undefined' 
          ? localStorage.getItem('fcmToken') 
          : null

        // Only initialize if token is not already stored
        if (!storedToken) {
          initializedRef.current = true
          
          // Initialize FCM with a delay to ensure service worker is ready
          setTimeout(() => {
            initializeFCM()
              .then(() => {
                console.log('[FCM Initializer] FCM initialized successfully')
              })
              .catch((error) => {
                console.warn('[FCM Initializer] Failed to initialize FCM (non-critical):', error)
                // Reset flag on error so it can retry
                initializedRef.current = false
              })
          }, 1500)
        } else {
          initializedRef.current = true
        }
      } else if (!isAuth) {
        // Reset flag when user logs out
        initializedRef.current = false
      }
    }

    // Check immediately
    checkAndInitialize()

    // Check once more after a delay (for OAuth callback), then stop
    // Don't use setInterval to avoid constant re-renders
    const timeout = setTimeout(() => {
      checkAndInitialize()
      // Clear the interval reference since we're not using it anymore
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current)
        checkIntervalRef.current = null
      }
    }, 3000)

    return () => {
      clearTimeout(timeout)
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current)
      }
    }
  }, [])

  return null
}

