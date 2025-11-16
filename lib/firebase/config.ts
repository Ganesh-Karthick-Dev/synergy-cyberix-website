import { initializeApp, getApps, FirebaseApp } from 'firebase/app'
import { getMessaging, Messaging } from 'firebase/messaging'

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

// Initialize Firebase
let app: FirebaseApp | undefined
let messaging: Messaging | null = null

if (typeof window !== 'undefined') {
  // Only initialize on client side
  if (!getApps().length) {
    // Check if all required config values are present
    const requiredConfig = [
      'apiKey',
      'authDomain',
      'projectId',
      'messagingSenderId',
      'appId',
    ]
    
    const missingConfig = requiredConfig.filter(
      (key) => !firebaseConfig[key as keyof typeof firebaseConfig]
    )
    
    if (missingConfig.length > 0) {
      console.warn(
        '[Firebase] Missing configuration:',
        missingConfig.join(', ')
      )
    } else {
      try {
        app = initializeApp(firebaseConfig)
        console.log('[Firebase] Initialized successfully')
      } catch (error) {
        console.error('[Firebase] Initialization error:', error)
      }
    }
  } else {
    app = getApps()[0]
  }

  // Initialize messaging if app is available
  // Wait for service worker to be ready before initializing messaging
  if (app && 'Notification' in window && 'serviceWorker' in navigator) {
    try {
      // Ensure service worker is ready before initializing messaging
      // This prevents Firebase from creating its own service worker
      navigator.serviceWorker.ready.then((registration) => {
        try {
          messaging = getMessaging(app, {
            serviceWorkerRegistration: registration,
          })
          console.log('[Firebase] Messaging initialized successfully with custom service worker')
        } catch (error) {
          console.error('[Firebase] Messaging initialization error:', error)
        }
      }).catch((error) => {
        console.warn('[Firebase] Service worker not ready, initializing messaging anyway:', error)
        try {
          messaging = getMessaging(app)
          console.log('[Firebase] Messaging initialized (service worker not ready)')
        } catch (err) {
          console.error('[Firebase] Messaging initialization error:', err)
        }
      })
    } catch (error) {
      console.error('[Firebase] Messaging initialization error:', error)
    }
  }
}

export { app, messaging, firebaseConfig }

