/**
 * Service Worker Registration for Firebase Cloud Messaging
 */

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  console.log('🔵 [Service Worker Registration] Starting registration process...')
  
  if (typeof window === 'undefined') {
    console.warn('[Service Worker Registration] Window is undefined')
    return null
  }

  if (!('serviceWorker' in navigator)) {
    console.error('[Service Worker Registration] ❌ Service workers are not supported')
    return null
  }

  console.log('[Service Worker Registration] ✅ Service workers are supported')

  try {
    // First, unregister any existing Firebase-created service workers
    console.log('[Service Worker Registration] Checking for existing service workers...')
    const allRegistrations = await navigator.serviceWorker.getRegistrations()
    console.log('[Service Worker Registration] Found', allRegistrations.length, 'existing service worker(s)')
    
    for (const registration of allRegistrations) {
      console.log('[Service Worker Registration] Existing SW:', registration.scope, 'State:', registration.active?.state || 'N/A')
      if (registration.scope.includes('firebase-cloud-messaging-push-scope')) {
        console.log('[Service Worker Registration] Unregistering Firebase-created service worker:', registration.scope)
        await registration.unregister()
      }
    }

    // Register the service worker
    console.log('[Service Worker Registration] Registering /firebase-messaging-sw.js...')
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
      scope: '/',
    })

    console.log('[Service Worker Registration] ✅ Registered successfully!')
    console.log('[Service Worker Registration] Scope:', registration.scope)
    console.log('[Service Worker Registration] Active:', !!registration.active)
    console.log('[Service Worker Registration] Installing:', !!registration.installing)
    console.log('[Service Worker Registration] Waiting:', !!registration.waiting)

    // Wait for the service worker to be ready
    console.log('[Service Worker Registration] Waiting for service worker to be ready...')
    await navigator.serviceWorker.ready
    console.log('[Service Worker Registration] ✅ Service worker is ready!')

    // Send Firebase config to service worker
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
    }

    // Check if all required config values are present
    const requiredConfig = ['apiKey', 'authDomain', 'projectId', 'messagingSenderId', 'appId']
    const missingConfig = requiredConfig.filter(
      (key) => !firebaseConfig[key as keyof typeof firebaseConfig]
    )

    if (missingConfig.length > 0) {
      console.warn('[Service Worker] Missing Firebase config:', missingConfig.join(', '))
      return registration
    }

    // Send config to service worker - try multiple times to ensure it's received
    const sendConfig = (target: ServiceWorker) => {
      if (target) {
        console.log('[Service Worker Registration] Sending Firebase config to service worker...')
        console.log('[Service Worker Registration] Config keys:', Object.keys(firebaseConfig))
        target.postMessage({
          type: 'FIREBASE_CONFIG',
          config: firebaseConfig,
        })
        console.log('[Service Worker Registration] ✅ Firebase config sent to service worker')
      } else {
        console.warn('[Service Worker Registration] ⚠️ Cannot send config - service worker target is null')
      }
    }

    // Send to active worker immediately
    if (registration.active) {
      sendConfig(registration.active)
    }

    // Also send to installing worker when it becomes active
    if (registration.installing) {
      registration.installing.addEventListener('statechange', () => {
        if (registration.active) {
          sendConfig(registration.active)
        }
      })
    }

    // Also send to waiting worker
    if (registration.waiting) {
      sendConfig(registration.waiting)
    }

    // Re-send config periodically to ensure it's received (for up to 5 seconds)
    let retryCount = 0
    const maxRetries = 10
    const retryInterval = setInterval(() => {
      if (retryCount >= maxRetries) {
        clearInterval(retryInterval)
        return
      }
      
      if (registration.active) {
        sendConfig(registration.active)
      }
      retryCount++
    }, 500)

    console.log('[Service Worker Registration] ✅ Registration process completed successfully')
    return registration
  } catch (error) {
    console.error('[Service Worker Registration] ❌ Registration failed:', error)
    console.error('[Service Worker Registration] Error details:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined,
    })
    return null
  }
}


