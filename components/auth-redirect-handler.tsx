"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"

/**
 * Component that handles redirecting to checkout after successful authentication
 * if a plan was selected before authentication
 */
export function AuthRedirectHandler() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in and has a selected planId
    const checkAndRedirect = () => {
      const isAuth = Cookies.get('isAuthenticated') === 'true'
      const token = Cookies.get('accessToken')
      const loggedIn = isAuth || !!token
      
      if (loggedIn && typeof window !== 'undefined') {
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

    // Also check periodically in case auth status changes (e.g., after OAuth callback)
    const interval = setInterval(checkAndRedirect, 1000)

    return () => clearInterval(interval)
  }, [router])

  return null
}


