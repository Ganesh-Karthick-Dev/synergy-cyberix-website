// Service Worker for Firebase Cloud Messaging
// This file must be in the public directory

console.log('🔵 [Service Worker] Service worker script loaded!')
console.log('🔵 [Service Worker] Script location:', self.location.href)
console.log('🔵 [Service Worker] Scope:', self.registration?.scope || 'N/A')

// Import Firebase scripts
console.log('🔵 [Service Worker] Loading Firebase scripts...')
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js')
console.log('🔵 [Service Worker] ✅ firebase-app-compat.js loaded')
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js')
console.log('🔵 [Service Worker] ✅ firebase-messaging-compat.js loaded')
console.log('🔵 [Service Worker] Firebase object available:', typeof firebase !== 'undefined')

// Firebase configuration - will be set by the main app
let firebaseConfig = null
let messaging = null
let isInitialized = false

// Initialize Firebase function
function initializeFirebase(config) {
  if (isInitialized) {
    console.log('[Service Worker] Firebase already initialized, skipping...')
    return
  }

  if (!config) {
    console.warn('[Service Worker] No Firebase config provided')
    return
  }

  try {
    console.log('[Service Worker] Initializing Firebase with config:', {
      apiKey: config.apiKey ? `${config.apiKey.substring(0, 10)}...` : 'MISSING',
      projectId: config.projectId || 'MISSING',
      messagingSenderId: config.messagingSenderId || 'MISSING',
    })

    // Check if firebase is available
    if (typeof firebase === 'undefined') {
      console.error('[Service Worker] ❌ Firebase scripts not loaded')
      return
    }

    console.log('[Service Worker] Firebase object:', typeof firebase)
    console.log('[Service Worker] Firebase.default:', typeof firebase.default)
    console.log('[Service Worker] Firebase.messaging:', typeof firebase.messaging)

    // For compat version, firebase is the namespace
    // Try firebase.default first (some versions), then firebase directly
    let firebaseApp = null
    if (firebase.default && typeof firebase.default.initializeApp === 'function') {
      firebaseApp = firebase.default
      console.log('[Service Worker] Using firebase.default')
    } else if (typeof firebase.initializeApp === 'function') {
      firebaseApp = firebase
      console.log('[Service Worker] Using firebase directly')
    } else {
      console.error('[Service Worker] ❌ Cannot find Firebase initializeApp method')
      console.error('[Service Worker] Available firebase properties:', Object.keys(firebase))
      return
    }
    
    if (!firebaseApp) {
      console.error('[Service Worker] ❌ Firebase app not available')
      return
    }

    // Initialize Firebase - check if already initialized
    let app
    try {
      app = firebaseApp.app()
      console.log('[Service Worker] Firebase app already exists, using existing app')
    } catch (e) {
      // App doesn't exist, initialize it
      app = firebaseApp.initializeApp(config)
      console.log('[Service Worker] ✅ Firebase app initialized')
    }
    
    // Retrieve an instance of Firebase Messaging
    // For compat version, messaging is on the namespace
    if (firebaseApp.messaging) {
      messaging = firebaseApp.messaging()
    } else if (firebase.messaging) {
      messaging = firebase.messaging()
    } else {
      console.error('[Service Worker] ❌ Cannot find Firebase messaging method')
      return
    }
    
    console.log('[Service Worker] ✅ Firebase messaging instance created:', !!messaging)
    
    // Handle background messages
    if (!messaging || typeof messaging.onBackgroundMessage !== 'function') {
      console.error('[Service Worker] ❌ messaging.onBackgroundMessage is not a function')
      console.error('[Service Worker] Messaging object:', messaging)
      return
    }

    console.log('[Service Worker] Registering onBackgroundMessage handler...')
    messaging.onBackgroundMessage((payload) => {
      console.log('[Service Worker] ✅✅✅ RECEIVED BACKGROUND MESSAGE ✅✅✅')
      console.log('[Service Worker] Full payload:', JSON.stringify(payload, null, 2))
      console.log('[Service Worker] Message details:', {
        notification: payload.notification,
        data: payload.data,
        messageId: payload.messageId,
        from: payload.from,
      })
      
      // Extract notification data - prioritize webpush notification, then notification, then data
      const notificationTitle = payload.notification?.title || payload.data?.title || 'New Notification'
      const notificationBody = payload.notification?.body || payload.data?.body || ''
      const notificationIcon = payload.notification?.icon || payload.data?.icon || '/favicon.ico'
      const notificationImage = payload.notification?.image || payload.data?.image
      
      const notificationOptions = {
        body: notificationBody,
        icon: notificationIcon,
        badge: '/favicon.ico',
        tag: payload.data?.notificationId || payload.messageId || 'default',
        data: payload.data || {},
        requireInteraction: false,
        actions: payload.data?.actions || [],
        vibrate: [200, 100, 200],
        timestamp: Date.now(),
      }

      // Add image if available
      if (notificationImage) {
        notificationOptions.image = notificationImage
      }

      console.log('[Service Worker] Showing notification:', {
        title: notificationTitle,
        body: notificationBody,
        icon: notificationIcon,
      })

      return self.registration.showNotification(notificationTitle, notificationOptions)
        .then(() => {
          console.log('[Service Worker] ✅ Notification displayed successfully')
        })
        .catch((error) => {
          console.error('[Service Worker] ❌ Error showing notification:', error)
        })
    })
    
    isInitialized = true
    firebaseConfig = config
    console.log('[Service Worker] ✅ Firebase initialized successfully and ready to receive messages')
  } catch (error) {
    console.error('[Service Worker] ❌ Firebase initialization error:', error)
    console.error('[Service Worker] Error details:', {
      message: error.message,
      stack: error.stack,
    })
  }
}

// Listen for config from main app
self.addEventListener('message', (event) => {
  console.log('[Service Worker] Received message:', event.data)
  if (event.data && event.data.type === 'FIREBASE_CONFIG') {
    console.log('[Service Worker] ✅ Received Firebase config from main app')
    firebaseConfig = event.data.config
    initializeFirebase(event.data.config)
  }
})

// Also try to initialize on service worker activation
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] 🔄 Service worker activated')
  event.waitUntil(
    self.clients.claim().then(() => {
      console.log('[Service Worker] ✅ Service worker claimed clients')
      // If we already have config, re-initialize
      if (firebaseConfig && !isInitialized) {
        console.log('[Service Worker] Re-initializing Firebase with stored config')
        initializeFirebase(firebaseConfig)
      }
    })
  )
})

// Log when service worker is installed
self.addEventListener('install', (event) => {
  console.log('[Service Worker] 📦 Service worker installed')
  event.waitUntil(self.skipWaiting())
})

// Handle push events (fallback for Firebase messages)
self.addEventListener('push', (event) => {
  console.log('[Service Worker] 🔔 Push event received!')
  console.log('[Service Worker] Push event data:', event.data)
  
  if (!event.data) {
    console.warn('[Service Worker] Push event has no data')
    return
  }

  try {
    const payload = event.data.json()
    console.log('[Service Worker] Push payload:', payload)
    
    const notificationTitle = payload.notification?.title || payload.data?.title || 'New Notification'
    const notificationBody = payload.notification?.body || payload.data?.body || ''
    const notificationIcon = payload.notification?.icon || payload.data?.icon || '/favicon.ico'
    
    const notificationOptions = {
      body: notificationBody,
      icon: notificationIcon,
      badge: '/favicon.ico',
      tag: payload.data?.notificationId || payload.messageId || 'default',
      data: payload.data || {},
      requireInteraction: false,
      vibrate: [200, 100, 200],
      timestamp: Date.now(),
    }

    if (payload.notification?.image || payload.data?.image) {
      notificationOptions.image = payload.notification?.image || payload.data?.image
    }

    event.waitUntil(
      self.registration.showNotification(notificationTitle, notificationOptions)
        .then(() => {
          console.log('[Service Worker] ✅ Notification displayed from push event')
        })
        .catch((error) => {
          console.error('[Service Worker] ❌ Error showing notification from push event:', error)
        })
    )
  } catch (error) {
    console.error('[Service Worker] ❌ Error parsing push event data:', error)
    // Try to show a basic notification anyway
    event.waitUntil(
      self.registration.showNotification('New Notification', {
        body: 'You have a new notification',
        icon: '/favicon.ico',
        badge: '/favicon.ico',
      })
    )
  }
})

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification clicked:', event)
  
  event.notification.close()
  
  // Get data from notification
  const data = event.notification.data || {}
  const urlToOpen = data.url || data.clickAction || '/'
  
  // Open or focus the window
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Check if there's already a window open
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i]
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus()
        }
      }
      // If no window is open, open a new one
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen)
      }
    })
  )
})

// Handle notification close
self.addEventListener('notificationclose', (event) => {
  console.log('[Service Worker] Notification closed:', event)
})
