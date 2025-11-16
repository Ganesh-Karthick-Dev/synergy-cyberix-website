"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"
import { initializeFCM } from '@/lib/firebase/fcm'

/**
 * Component that handles redirecting to checkout after successful authentication
 * if a plan was selected before authentication
 * Also initializes FCM for Google OAuth logins
 */
export function AuthRedirectHandler() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in and has a selected planId or redirect URL
    const checkAndRedirect = () => {
      const isAuth = Cookies.get('isAuthenticated') === 'true'
      const token = Cookies.get('accessToken')
      const loggedIn = isAuth || !!token
      
      if (loggedIn && typeof window !== 'undefined') {
        // Initialize FCM if not already initialized (for Google OAuth)
        // This ensures FCM token is sent to backend after Google OAuth login
        const storedToken = localStorage.getItem('fcmToken')
        if (!storedToken) {
          // Initialize FCM immediately (don't wait, but start it)
          initializeFCM()
            .then(() => {
              console.log('[Auth Redirect Handler] FCM initialized after OAuth')
            })
            .catch((error) => {
              console.warn('[Auth Redirect Handler] FCM initialization failed (non-critical):', error)
            })
        }
        
        // Check for redirect after login (e.g., from download page)
        const redirectAfterLogin = sessionStorage.getItem('redirectAfterLogin')
        if (redirectAfterLogin) {
          sessionStorage.removeItem('redirectAfterLogin')
          router.push(redirectAfterLogin)
          return
        }

        // Check for selected planId (redirect to checkout)
        const selectedPlanId = sessionStorage.getItem('selectedPlanId')
        if (selectedPlanId) {
          // Clear the stored planId and redirect to checkout
          sessionStorage.removeItem('selectedPlanId')
          router.push(`/checkout?planId=${selectedPlanId}`)
        }
      }
    }

    // Check immediately
    checkAndRedirect()

    // Check a few more times for OAuth callback, then stop
    // Don't use constant interval to avoid repeated API calls
    let checkCount = 0
    const maxChecks = 5 // Check 5 times over 5 seconds
    const interval = setInterval(() => {
      checkCount++
      checkAndRedirect()
      
      // Stop after max checks
      if (checkCount >= maxChecks) {
        clearInterval(interval)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [router])

  return null
}


