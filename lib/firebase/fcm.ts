import { messaging, app } from './config'
import { getMessaging, getToken } from 'firebase/messaging'
import apiClient from '@/lib/api/client'

/**
 * Request FCM token from Firebase
 * This token is used to send push notifications to this device
 */
export async function requestFCMToken(): Promise<string | null> {
  if (typeof window === 'undefined') {
    console.warn('[FCM] Cannot request token on server side')
    return null
  }

  // Ensure Firebase messaging is initialized
  let messagingInstance = messaging
  if (!messagingInstance) {
    if (!app) {
      console.error('[FCM] ❌ Firebase app not initialized')
      return null
    }
    console.log('[FCM] Messaging not initialized, initializing now...')
    try {
      // getMessaging can only be called once per app, so we check if it's already initialized
      // If it throws, it means messaging is already initialized elsewhere
      try {
        messagingInstance = getMessaging(app)
        console.log('[FCM] ✅ Messaging initialized')
      } catch (getMessagingError: any) {
        // If error says messaging already exists, try to get it from the app
        if (getMessagingError?.code === 'messaging/already-initialized' || getMessagingError?.message?.includes('already')) {
          console.log('[FCM] Messaging already initialized, using existing instance')
          // Re-import to get the initialized instance
          const { messaging: existingMessaging } = await import('./config')
          messagingInstance = existingMessaging
        } else {
          throw getMessagingError
        }
      }
    } catch (error) {
      console.error('[FCM] ❌ Failed to initialize messaging:', error)
      return null
    }
  }
  
  if (!messagingInstance) {
    console.error('[FCM] ❌ Messaging not available and could not be initialized')
    return null
  }

  // Check if browser supports notifications
  if (!('Notification' in window)) {
    console.warn('[FCM] This browser does not support notifications')
    return null
  }

  // Check if service worker is supported
  if (!('serviceWorker' in navigator)) {
    console.warn('[FCM] This browser does not support service workers')
    return null
  }

  try {
    // Ensure service worker is ready before requesting token
    console.log('[FCM] Waiting for service worker to be ready...')
    const registration = await navigator.serviceWorker.ready
    console.log('[FCM] Service worker is ready:', registration.scope)

    // Request notification permission
    console.log('[FCM] Requesting notification permission...')
    const permission = await Notification.requestPermission()
    
    if (permission !== 'granted') {
      console.warn('[FCM] Notification permission not granted, permission status:', permission)
      return null
    }
    console.log('[FCM] Notification permission granted')

    // Get VAPID key from environment
    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
    
    if (!vapidKey) {
      console.error('[FCM] VAPID key not found in environment variables')
      return null
    }
    console.log('[FCM] VAPID key found, requesting FCM token...')

    // Get FCM token - explicitly use our service worker
    const token = await getToken(messagingInstance, {
      vapidKey: vapidKey,
      serviceWorkerRegistration: await navigator.serviceWorker.ready,
    })

    if (token) {
      console.log('[FCM] ✅ Token obtained successfully:', token.substring(0, 20) + '...')
      return token
    } else {
      console.warn('[FCM] No token available from Firebase')
      return null
    }
  } catch (error) {
    console.error('[FCM] ❌ Error getting token:', error)
    if (error instanceof Error) {
      console.error('[FCM] Error details:', {
        message: error.message,
        stack: error.stack,
      })
    }
    return null
  }
}

/**
 * Store FCM token on backend
 */
export async function storeFCMToken(fcmToken: string): Promise<void> {
  try {
    console.log('[FCM] Storing token on backend:', fcmToken.substring(0, 20) + '...')
    const response = await apiClient.post('/api/fcm/token', {
      fcmToken,
    })
    console.log('[FCM] Token stored successfully on backend', response.data)
  } catch (error) {
    console.error('[FCM] Error storing token:', error)
    throw error
  }
}

/**
 * Remove FCM token from backend
 * Removes only the specific token (current device instance)
 */
export async function removeFCMToken(fcmToken: string): Promise<void> {
  try {
    console.log('[FCM] Calling backend to remove FCM token:', fcmToken.substring(0, 20) + '...')
    const response = await apiClient.delete('/api/fcm/token', {
      data: { fcmToken },
    })
    console.log('[FCM] ✅ Token removed successfully from backend:', response.data)
  } catch (error: any) {
    console.error('[FCM] ❌ Error removing token:', error)
    // If it's a 401 (unauthorized), user might already be logged out, which is fine
    if (error?.response?.status === 401) {
      console.warn('[FCM] ⚠️ User already logged out, token removal skipped')
      return
    }
    throw error
  }
}

/**
 * Remove all FCM tokens for the current user
 */
export async function removeAllFCMTokens(): Promise<void> {
  try {
    await apiClient.delete('/api/fcm/tokens/all')
    console.log('[FCM] All tokens removed successfully from backend')
  } catch (error) {
    console.error('[FCM] Error removing all tokens:', error)
    throw error
  }
}

/**
 * Initialize FCM and request token
 * Call this after user login
 */
export async function initializeFCM(): Promise<string | null> {
  try {
    // First, ensure service worker is registered
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.ready
        console.log('[FCM] Service worker is ready')
        
        // Send Firebase config to service worker if not already sent
        const firebaseConfig = {
          apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
          authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
          messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
          appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
          measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
        }
        
        if (registration.active) {
          registration.active.postMessage({
            type: 'FIREBASE_CONFIG',
            config: firebaseConfig,
          })
        }
      } catch (error) {
        console.warn('[FCM] Service worker not ready, continuing anyway:', error)
      }
    }
    
    console.log('[FCM] Requesting FCM token...')
    const token = await requestFCMToken()
    
    if (token) {
      console.log('[FCM] Token obtained, storing on backend...')
      // Store token on backend
      await storeFCMToken(token)
      console.log('[FCM] Token stored on backend successfully')
      // Store token in localStorage for later use
      if (typeof window !== 'undefined') {
        localStorage.setItem('fcmToken', token)
        console.log('[FCM] Token stored in localStorage')
      }
      return token
    } else {
      console.warn('[FCM] No token obtained')
    }
    
    return null
  } catch (error) {
    console.error('[FCM] Error initializing FCM:', error)
    return null
  }
}

/**
 * Cleanup FCM token
 * Call this on user logout
 * Removes only the current device's FCM token (not all tokens)
 */
export async function cleanupFCM(): Promise<void> {
  try {
    // Get stored token from localStorage (this is the current device's token)
    const storedToken = typeof window !== 'undefined' 
      ? localStorage.getItem('fcmToken') 
      : null

    if (!storedToken) {
      console.warn('[FCM] ⚠️ No FCM token found in localStorage, nothing to remove')
      return
    }

    console.log('[FCM] 🔄 Removing current device FCM token:', storedToken.substring(0, 20) + '...')
    console.log('[FCM] 📤 Calling backend API to remove token...')
    
    // Remove only this specific token from backend (current device instance)
    // This must happen BEFORE logout so user is still authenticated
    await removeFCMToken(storedToken)
    
    console.log('[FCM] ✅ Current device FCM token removed from backend')
    
    // Remove token from localStorage after successful backend removal
    if (typeof window !== 'undefined') {
      localStorage.removeItem('fcmToken')
      console.log('[FCM] ✅ FCM token removed from localStorage')
    }
  } catch (error: any) {
    console.error('[FCM] ❌ Error cleaning up FCM:', error)
    console.error('[FCM] Error details:', {
      message: error?.message,
      response: error?.response?.data,
      status: error?.response?.status,
      url: error?.config?.url,
    })
    // Re-throw so logout can handle it
    throw error
  }
}

