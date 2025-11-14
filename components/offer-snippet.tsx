"use client"
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { useRegistration } from "@/components/registration-context"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"
import { useAuth } from "@/components/auth-context"
import { useQuery } from "@tanstack/react-query"

async function fetchActiveSubscription() {
  try {
    const response = await fetch('/api/subscription/active', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      cache: 'no-store'
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data.data || null
  } catch (error) {
    return null
  }
}

export function OfferSnippet() {
  const router = useRouter()
  const { openLoginModal } = useAuth()
  const [isVisible, setIsVisible] = useState(true)
  const isLoggedIn = Cookies.get('isAuthenticated') === 'true' || !!Cookies.get('accessToken')

  // Fetch active subscription
  const { data: activeSubscription } = useQuery({
    queryKey: ['activeSubscription', 'offer-snippet'],
    queryFn: fetchActiveSubscription,
    enabled: isLoggedIn,
    refetchInterval: 60000,
    retry: false,
    staleTime: 0,
  })

  // Handle CTA button click
  const handleCTAClick = () => {
    const isAuth = Cookies.get('isAuthenticated') === 'true'
    const token = Cookies.get('accessToken')
    const loggedIn = isAuth || !!token

    if (!loggedIn) {
      // Not logged in - show login modal
      openLoginModal()
      return
    }

    // Check if user has active subscription
    if (activeSubscription) {
      const endDate = activeSubscription.endDate ? new Date(activeSubscription.endDate) : null
      const isLifetime = activeSubscription.endDate === null
      const now = new Date()
      const isExpired = endDate ? endDate <= now : false
      const hasActive = activeSubscription.status === 'ACTIVE' && (isLifetime || !isExpired)
      
      if (hasActive) {
        // Has active subscription - redirect to download
        router.push('/download')
        return
      }
    }

    // Logged in but no active subscription - show login
    openLoginModal()
  }

  useEffect(() => {
    if (isVisible) {
      document.body.style.paddingBottom = '80px'
    } else {
      document.body.style.paddingBottom = '0px'
    }
    
    return () => {
      document.body.style.paddingBottom = '0px'
    }
  }, [isVisible])

  if (!isVisible) return null

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-orange-400/90 to-orange-500/90 backdrop-blur-sm border-t border-orange-300/30 shadow-lg"
      style={{ 
        clipPath: 'ellipse(100% 100% at 50% 100%)'
      
      }}
    >
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left side - Text */}
          <div className="flex-1 text-center sm:text-left">
            <p className="text-white font-semibold text-sm sm:text-base" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}>
              Start Now — Get Your First 2 Websites Scanned Free!
            </p>
          </div>
          
          {/* Right side - Button and Close */}
          <div className="flex items-center gap-3 ml-4">
            <Button 
              onClick={handleCTAClick}
              size="sm"
              className="bg-white text-orange-600 hover:bg-orange-50 px-4 py-2 text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 whitespace-nowrap cursor-pointer"
              style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}
            >
              Start Free Scan
            </Button>
            
            <button
              onClick={() => setIsVisible(false)}
              className="text-white/80 hover:text-white transition-colors duration-200 p-1"
              aria-label="Close banner"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
