"use client"

import { useState, useEffect } from 'react'
import ShinyText from '@/components/ShinyText'
import { X, Rocket } from 'lucide-react'

export function PromotionalBanner() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Update body padding when banner visibility changes
    if (isVisible) {
      document.body.style.paddingTop = '48px'
    } else {
      document.body.style.paddingTop = '0px'
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.paddingTop = '0px'
    }
  }, [isVisible])

  return (
    <div 
      className={`fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-orange-400 to-orange-500 text-white px-2 sm:px-4 transition-all duration-300 ${
        isVisible ? 'py-2 sm:py-3 opacity-100' : 'py-0 opacity-0 h-0'
      }`}
      data-banner
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center text-center pr-8 sm:pr-0">
          <p className="text-xs sm:text-sm font-medium leading-snug sm:leading-normal break-words">
            <ShinyText>
              <Rocket className="inline w-4 h-4 mr-1" />
              <span className="font-bold">FREE TRIAL AVAILABLE:</span> Get your first 2 websites scanned free! 
              <span className="ml-2 font-bold text-orange-100">No credit card required</span>
            </ShinyText>
          </p>
        </div>
      </div>
      
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-200 transition-colors"
        aria-label="Close banner"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}