"use client"

import { Button } from "@/components/ui/button"
import { Star, Menu, X } from "lucide-react"
import { useState, useEffect, useRef } from 'react'
import { useRegistration } from "@/components/registration-context"
import { useAuth } from "@/components/auth-context"
import Cookies from 'js-cookie'
import { ProfileDropdown } from "@/components/profile-dropdown"

export function HeroSection() {
  const [bannerHeight, setBannerHeight] = useState(0)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userInfo, setUserInfo] = useState<{ email?: string; name?: string } | null>(null)
  const { openModal } = useRegistration()
  const { openLoginModal, openRegisterModal } = useAuth()
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const updateBannerHeight = () => {
      const banner = document.querySelector('[data-banner]') as HTMLElement
      if (banner) {
        setBannerHeight(banner.offsetHeight)
      } else {
        setBannerHeight(0)
      }
    }

    // Initial check
    updateBannerHeight()

    // Watch for banner changes (when it's closed)
    const observer = new MutationObserver(updateBannerHeight)
    observer.observe(document.body, { childList: true, subtree: true })

    // Also listen for resize events
    window.addEventListener('resize', updateBannerHeight)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', updateBannerHeight)
    }
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-slide-up')
          }
        })
      },
      { threshold: 0.1 }
    )

    const elements = sectionRef.current?.querySelectorAll('.animate-on-scroll')
    elements?.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  // Check if user is logged in (has access token or isAuthenticated cookie)
  useEffect(() => {
    const checkAuthStatus = () => {
      const isAuth = Cookies.get('isAuthenticated') === 'true'
      const token = Cookies.get('accessToken')
      const loggedIn = isAuth || !!token
      setIsLoggedIn(loggedIn)
      
      // If logged in, try to get user info from cookies
      if (loggedIn) {
        const email = Cookies.get('userEmail')
        const name = Cookies.get('userName')
        if (email || name) {
          setUserInfo({ email: email || undefined, name: name || undefined })
        }
      } else {
        setUserInfo(null)
      }
    }

    checkAuthStatus()
    // Check periodically in case cookie is updated in another tab
    const interval = setInterval(checkAuthStatus, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen flex flex-col transition-all duration-300 ease-in-out"
      style={{
        paddingTop: `${bannerHeight}px`
      }}
    >
      {/* Video Background */}
      <video 
        autoPlay 
        muted 
        loop 
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/video/c1.mp4" type="video/mp4" />
      </video>
      
      {/* Background Overlay for reduced opacity */}
      <div className="absolute inset-0 bg-black/40"></div>
      
      {/* Navigation Header */}
      <header 
        className="fixed left-0 right-0 z-40 flex items-center justify-between py-3 px-6 lg:px-12 bg-black/20 backdrop-blur-md border-b border-white/10"
        style={{ top: `${bannerHeight}px` }}
      >
        <div className="flex items-center">
          <div className="w-48 h-20 rounded flex items-center justify-center">
            <img 
              src="/Cybersecurity research-01.png" 
              alt="Cyberix Logo" 
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Desktop Nav (large screens only) */}
        <nav className="hidden lg:flex items-center space-x-10">
          <a href="#" className="text-white hover:text-orange-400 transition-colors text-lg font-medium" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '500' }}>
            Home
          </a>
          
          <a href="#about-us" className="text-white hover:text-orange-400 transition-colors text-lg font-medium" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '500' }}>
            About us
          </a>
          <a href="#why-choose" className="text-white hover:text-orange-400 transition-colors text-lg font-medium" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '500' }}>
            Services
          </a>
          <a href="#warning" className="text-white hover:text-orange-400 transition-colors text-lg font-medium" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '500' }}>
            Contact us
          </a>
        </nav>

        {/* Desktop Login/Profile Dropdown (large screens only) */}
        <div className="hidden lg:block">
          {isLoggedIn ? (
            <ProfileDropdown 
              userEmail={userInfo?.email}
              userName={userInfo?.name}
            />
          ) : (
            <Button 
              onClick={openLoginModal}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg text-lg font-semibold cursor-pointer" 
              style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}
            >
              Login
            </Button>
          )}
        </div>

        {/* Mobile/Tablet controls */}
        <div className="lg:hidden flex items-center gap-3">
          {isLoggedIn ? (
            <ProfileDropdown 
              userEmail={userInfo?.email}
              userName={userInfo?.name}
            />
          ) : (
            <Button 
              onClick={openLoginModal}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer" 
              style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}
            >
              Login
            </Button>
          )}
          <button
            aria-label="Toggle menu"
            onClick={() => setMobileNavOpen(v => !v)}
            className="text-white p-2 rounded-md bg-white/10 hover:bg-white/20 transition-colors"
          >
            {mobileNavOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Panel */}
      {mobileNavOpen && (
        <div className="fixed left-0 right-0 z-30 mt-[calc(48px+var(--banner-offset,0px))] lg:hidden" style={{ top: `${bannerHeight + 56}px` }}>
          <div className="mx-4 rounded-lg bg-black/80 backdrop-blur-md border border-white/10 p-4 space-y-3">
            <a onClick={() => setMobileNavOpen(false)} href="#" className="block text-white text-base">Home</a>
            <a onClick={() => setMobileNavOpen(false)} href="#about-us" className="block text-white text-base">About us</a>
            <a onClick={() => setMobileNavOpen(false)} href="#why-choose" className="block text-white text-base">Services</a>
            <a onClick={() => setMobileNavOpen(false)} href="#warning" className="block text-white text-base">Contact us</a>
            {isLoggedIn && (
              <div className="pt-2 border-t border-white/10">
                <ProfileDropdown 
                  userEmail={userInfo?.email}
                  userName={userInfo?.name}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Hero Content */}
      <div 
        className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 lg:px-12 text-center"
        style={{ paddingTop: `${bannerHeight + 120}px` }}
      >


        {/* Main Headline */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-2 sm:mb-3 md:mb-4 lg:mb-4 max-w-8xl leading-tight h-85 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '700' }}>
            AI-Powered <span className="text-orange-500">Cybersecurity</span>
            <br />
            Platform
        </h2>
        <h5 className="text-white/90 text-xl leading-relaxed mb-6 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700" style={{ transitionDelay: '200ms', fontFamily: 'Orbitron, sans-serif', fontWeight: '500' }}>
            Detect vulnerabilities, block phishing, and monitor threats — all in one platform with instant PDF reports.
        </h5>

        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700" style={{ transitionDelay: '400ms' }}>
          <Button 
            onClick={openModal}
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg text-lg font-semibold cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300"
            style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}
          >
            Start Free Security Scan
          </Button>
        </div>
      </div>
    </section>
  )
}
