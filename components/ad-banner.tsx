"use client"

import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getActiveAds } from '@/lib/api/website'
import { trackAdImpression, trackAdClick, type Ad } from '@/lib/api/ads'
import { X } from 'lucide-react'

export function AdBanner() {
  const [isVisible, setIsVisible] = useState(true)
  const [hasTrackedImpressions, setHasTrackedImpressions] = useState(false)

  // Fetch active ads
  const { data: ads = [], isLoading, error } = useQuery({
    queryKey: ['activeAds'],
    queryFn: getActiveAds,
    refetchInterval: 60000, // Refetch every minute
    staleTime: 30000, // Consider data stale after 30 seconds
    retry: 2,
  })

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

  // Track impressions when ads are displayed
  useEffect(() => {
    if (activeAds.length > 0 && !hasTrackedImpressions && isVisible) {
      console.log(`[AdBanner] Tracking impressions for ${activeAds.length} ad(s)`)
      activeAds.forEach((ad: Ad) => {
        trackAdImpression(ad.id).catch((error) => {
          console.error(`[AdBanner] Failed to track impression for ad ${ad.id}:`, error)
        })
      })
      setHasTrackedImpressions(true)
    }
  }, [activeAds, hasTrackedImpressions, isVisible])

  // Update body padding when banner visibility changes
  useEffect(() => {
    if (isVisible && activeAds.length > 0) {
      document.body.style.paddingTop = '48px'
    } else {
      document.body.style.paddingTop = '0px'
    }
    
    return () => {
      document.body.style.paddingTop = '0px'
    }
  }, [isVisible, activeAds.length])

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

  // Don't render if user closed the banner
  if (!isVisible) {
    console.log('[AdBanner] Banner closed by user')
    return null
  }

  console.log(`[AdBanner] Rendering banner with ${activeAds.length} ad(s)`)

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
                    Learn More →
                  </button>
                )}
              </div>
            ))}
          </div>
          
          {/* Fixed button on the right side */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 z-50 flex items-center gap-2">
            <button
              className="relative whitespace-nowrap px-6 py-2.5 rounded-lg font-semibold text-sm text-orange-600 bg-white/95 backdrop-blur-sm border border-white/50 shadow-[0_4px_20px_rgba(0,0,0,0.1),0_0_0_1px_rgba(255,255,255,0.5)_inset] hover:shadow-[0_6px_30px_rgba(0,0,0,0.15),0_0_0_1px_rgba(255,255,255,0.7)_inset] hover:bg-white transition-all hover:scale-105 active:scale-95 overflow-hidden group"
              style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}
            >
              {/* Glossy overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/20 to-transparent opacity-60 pointer-events-none rounded-lg"></div>
              {/* Highlight effect */}
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/80 to-transparent rounded-t-lg pointer-events-none"></div>
              {/* Text with slight shadow for depth */}
              <span className="relative z-10 drop-shadow-sm">Protect your website today</span>
            </button>
            
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
