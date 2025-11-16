"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useWebsiteData } from '@/hooks/use-website-data'
import { trackAdImpression, trackAdClick, type Ad } from '@/lib/api/ads'
import { X } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export function AdBanner() {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(true)
  const [hasTrackedImpressions, setHasTrackedImpressions] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(true) // For mobile modal
  const [isModalClosed, setIsModalClosed] = useState(false) // Track if user explicitly closed the modal

  // Extract discount percentage from ad title (e.g., "75% offer" -> 75)
  const extractDiscountPercentage = (title: string): number | null => {
    const match = title.match(/(\d+)%/i)
    return match ? parseInt(match[1], 10) : null
  }

  // Handle Purchase Now button click
  const handlePurchaseNow = async (ad: Ad) => {
    try {
      // Track ad click
      await trackAdClick(ad.id)
      
      // Extract discount percentage
      const discountPercent = extractDiscountPercentage(ad.title)
      
      // Navigate to pricing page with discount
      if (discountPercent) {
        router.push(`/pricing?discount=${discountPercent}`)
      } else {
        router.push('/pricing')
      }
    } catch (error) {
      console.error(`[AdBanner] Failed to track click for ad ${ad.id}:`, error)
      // Still navigate even if tracking fails
      const discountPercent = extractDiscountPercentage(ad.title)
      if (discountPercent) {
        router.push(`/pricing?discount=${discountPercent}`)
      } else {
        router.push('/pricing')
      }
    }
  }

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024) // lg breakpoint
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Fetch website data (includes ads) using shared hook
  const { data: websiteData, isLoading, error } = useWebsiteData()
  const ads = websiteData?.ads || []

  // Simple filter: show all ads that are active
  // For now, ignore date range checking - show all active ads
  // This ensures ads display reliably for testing
  const activeAds = ads.filter((ad: Ad) => {
    // Must be active
    if (!ad.isActive) {
      console.log(`[AdBanner] Ad "${ad.title}" filtered: isActive=false`)
      return false
    }

    // Show all active ads regardless of date range
    // Date range checking can be enabled later if needed
    console.log(`[AdBanner] Ad "${ad.title}" shown: isActive=true`)
    return true
  })

  // Open modal automatically on mobile when ads are available (only if user hasn't closed it)
  useEffect(() => {
    if (isMobile && activeAds.length > 0 && !isModalOpen && !isModalClosed) {
      setIsModalOpen(true)
    }
  }, [isMobile, activeAds.length, isModalOpen, isModalClosed])

  // Track impressions when ads are displayed
  useEffect(() => {
    if (activeAds.length > 0 && !hasTrackedImpressions && (isVisible || isModalOpen)) {
      console.log(`[AdBanner] Tracking impressions for ${activeAds.length} ad(s)`)
      activeAds.forEach((ad: Ad) => {
        trackAdImpression(ad.id).catch((error) => {
          console.error(`[AdBanner] Failed to track impression for ad ${ad.id}:`, error)
        })
      })
      setHasTrackedImpressions(true)
    }
  }, [activeAds, hasTrackedImpressions, isVisible, isModalOpen])

  // Update body padding when banner visibility changes (desktop only)
  useEffect(() => {
    if (!isMobile && isVisible && activeAds.length > 0) {
      document.body.style.paddingTop = '48px'
    } else {
      document.body.style.paddingTop = '0px'
    }
    
    return () => {
      document.body.style.paddingTop = '0px'
    }
  }, [isVisible, activeAds.length, isMobile])

  // Handle ad click
  const handleAdClick = async (ad: Ad) => {
    try {
      await trackAdClick(ad.id)
      if (ad.link) {
        window.open(ad.link, '_blank', 'noopener,noreferrer')
      }
    } catch (error) {
      console.error(`[AdBanner] Failed to track click for ad ${ad.id}:`, error)
      if (ad.link) {
        window.open(ad.link, '_blank', 'noopener,noreferrer')
      }
    }
  }

  // Always log state for debugging
  useEffect(() => {
    console.log('[AdBanner] Current state:', {
      isLoading,
      error: error?.message,
      totalAds: ads.length,
      activeAdsCount: activeAds.length,
      isVisible,
      ads: ads.map(ad => ({
        id: ad.id,
        title: ad.title,
        isActive: ad.isActive,
        startDate: ad.startDate,
        endDate: ad.endDate,
      })),
    })
  }, [isLoading, error, ads, activeAds, isVisible])

  // Don't render if loading
  if (isLoading) {
    console.log('[AdBanner] Still loading...')
    return null
  }

  // Log error but don't block rendering
  if (error) {
    console.error('[AdBanner] Error fetching ads:', error)
  }

  // Don't render if no active ads
  if (activeAds.length === 0) {
    console.log('[AdBanner] No active ads to display')
    return null
  }

  // Don't render if user closed the banner (desktop only)
  if (!isMobile && !isVisible) {
    console.log('[AdBanner] Banner closed by user')
    return null
  }

  // Don't render if user closed the modal (mobile only)
  if (isMobile && (isModalClosed || !isModalOpen)) {
    console.log('[AdBanner] Modal closed by user')
    return null
  }

  console.log(`[AdBanner] Rendering ${isMobile ? 'modal' : 'banner'} with ${activeAds.length} ad(s)`)

  // Handle modal close
  const handleModalClose = (open: boolean) => {
    setIsModalOpen(open)
    if (!open) {
      setIsModalClosed(true) // Mark as closed by user
    }
  }

  // Mobile: Show as modal popup
  if (isMobile) {
    return (
      <Dialog open={isModalOpen && !isModalClosed} onOpenChange={handleModalClose}>
        <DialogContent className="!max-w-[90vw] sm:!max-w-md w-full bg-gradient-to-br from-gray-900 via-gray-800 to-black border-2 border-orange-500/30 shadow-2xl shadow-orange-500/20 p-6">
          <DialogHeader className="space-y-4">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-bold text-white" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '700' }}>
                Special Offer
              </DialogTitle>
              <button
                onClick={() => handleModalClose(false)}
                className="text-white/70 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10 cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </DialogHeader>
          
          <div className="space-y-4">
            {activeAds.map((ad) => (
              <div
                key={ad.id}
                className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 border border-orange-500/30 rounded-lg p-4 space-y-3"
              >
                <h3 
                  className="text-xl font-bold text-orange-400" 
                  style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '700' }}
                >
                  {ad.title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                  {ad.content}
                </p>
                <button
                  onClick={() => handlePurchaseNow(ad)}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-orange-500/30"
                  style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}
                >
                  Purchase Now
                </button>
                <button
                  onClick={() => handleModalClose(false)}
                  className="w-full bg-white/10 hover:bg-white/20 text-white font-medium py-2.5 px-6 rounded-lg transition-all duration-300 border border-white/20"
                  style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '500' }}
                >
                  Maybe Later
                </button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  // Desktop: Show as banner (current behavior)
  return (
    <>
      <div 
        className="fixed top-0 left-0 right-0 z-[9999] bg-gradient-to-r from-orange-500 to-orange-600 text-white overflow-hidden shadow-lg"
        data-banner="true"
        style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999 }}
      >
        {/* Marquee Container */}
        <div className="relative py-3 pr-32">
          {/* Animated Marquee */}
          <div 
            className="flex whitespace-nowrap"
            style={{
              animation: 'marquee 30s linear infinite',
            }}
          >
            {/* Render ads multiple times for seamless loop */}
            {[...activeAds, ...activeAds, ...activeAds].map((ad, index) => (
              <div
                key={`${ad.id}-${index}`}
                className="flex items-center gap-4 mr-12 inline-flex flex-shrink-0"
              >
                <span 
                  className="font-semibold text-base whitespace-nowrap" 
                  style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '700' }}
                >
                  {ad.title}
                </span>
                <span className="text-orange-100 text-sm whitespace-nowrap max-w-md truncate">
                  {ad.content}
                </span>
                {ad.link && (
                  <button
                    onClick={() => handleAdClick(ad)}
                    className="bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors backdrop-blur-sm whitespace-nowrap cursor-pointer"
                    style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}
                  >
                    Learn More
                  </button>
                )}
              </div>
            ))}
          </div>
          
          {/* Fixed button on the right side */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 z-50 flex items-center gap-2">
            {activeAds.length > 0 && (
              <button
                onClick={() => handlePurchaseNow(activeAds[0])}
                className="relative whitespace-nowrap px-6 py-2.5 rounded-lg font-semibold text-sm text-orange-600 bg-white/95 backdrop-blur-sm border border-white/50 shadow-[0_4px_20px_rgba(0,0,0,0.1),0_0_0_1px_rgba(255,255,255,0.5)_inset] hover:shadow-[0_6px_30px_rgba(0,0,0,0.15),0_0_0_1px_rgba(255,255,255,0.7)_inset] hover:bg-white transition-all hover:scale-105 active:scale-95 overflow-hidden group cursor-pointer"
                style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}
              >
                {/* Glossy overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/20 to-transparent opacity-60 pointer-events-none rounded-lg"></div>
                {/* Highlight effect */}
                <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/80 to-transparent rounded-t-lg pointer-events-none"></div>
                {/* Text with slight shadow for depth */}
                <span className="relative z-10 drop-shadow-sm">Purchase Now</span>
              </button>
            )}
            
            {/* Close Button */}
            <button
              onClick={() => setIsVisible(false)}
              className="text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-white/20"
              aria-label="Close banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Marquee Animation CSS */}
      <style jsx global>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
      `}</style>
    </>
  )
}
