"use client"

import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useState, useEffect } from 'react'
import { useAuth } from "@/components/auth-context"
import Cookies from 'js-cookie'
import { ProfileDropdown } from "@/components/profile-dropdown"
import Link from "next/link"

export function SharedNavbar() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userInfo, setUserInfo] = useState<{ email?: string; name?: string } | null>(null)
  const [navbarTop, setNavbarTop] = useState('0px')
  const { openLoginModal } = useAuth()

  // Check if banner is visible and adjust navbar position
  useEffect(() => {
    const checkBannerVisibility = () => {
      const banner = document.querySelector('[data-banner="true"]')
      if (banner && window.getComputedStyle(banner).display !== 'none') {
        const bannerHeight = banner.getBoundingClientRect().height
        setNavbarTop(`${bannerHeight}px`)
      } else {
        setNavbarTop('0px')
      }
    }

    checkBannerVisibility()
    const interval = setInterval(checkBannerVisibility, 100)
    const observer = new MutationObserver(checkBannerVisibility)
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['style'] })
    
    return () => {
      clearInterval(interval)
      observer.disconnect()
    }
  }, [])

  // Check if user is logged in
  useEffect(() => {
    const checkAuthStatus = () => {
      const isAuth = Cookies.get('isAuthenticated') === 'true'
      const token = Cookies.get('accessToken')
      const loggedIn = isAuth || !!token
      setIsLoggedIn(loggedIn)
      
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
    const interval = setInterval(checkAuthStatus, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      {/* Navigation Header */}
      <header className="fixed left-0 right-0 z-40 flex items-center justify-between py-3 px-6 lg:px-12 bg-black/20 backdrop-blur-md border-b border-white/10" style={{ top: navbarTop }}>
        <Link href="/" className="flex items-center">
          <div className="w-48 h-20 rounded flex items-center justify-center">
            <img 
              src="/Cybersecurity research-01.png" 
              alt="Cyberix Logo" 
              className="w-full h-full object-contain"
            />
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center space-x-12">
          <Link 
            href="/" 
            className="relative text-white hover:text-orange-400 transition-all duration-300 text-lg font-semibold group overflow-hidden px-2 py-1"
            style={{ 
              fontFamily: 'Orbitron, sans-serif', 
              fontWeight: '600',
              textShadow: '0 0 10px rgba(255, 255, 255, 0.3), 0 0 20px rgba(255, 255, 255, 0.1)',
            }}
          >
            <span className="relative z-10">Home</span>
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-orange-600/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"></div>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-600 group-hover:w-full transition-all duration-300"></span>
          </Link>
          
          <Link 
            href="/#about-us" 
            className="relative text-white hover:text-orange-400 transition-all duration-300 text-lg font-semibold group overflow-hidden px-2 py-1"
            style={{ 
              fontFamily: 'Orbitron, sans-serif', 
              fontWeight: '600',
              textShadow: '0 0 10px rgba(255, 255, 255, 0.3), 0 0 20px rgba(255, 255, 255, 0.1)',
            }}
          >
            <span className="relative z-10">About us</span>
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-orange-600/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"></div>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-600 group-hover:w-full transition-all duration-300"></span>
          </Link>
          
          <Link 
            href="/#why-choose" 
            className="relative text-white hover:text-orange-400 transition-all duration-300 text-lg font-semibold group overflow-hidden px-2 py-1"
            style={{ 
              fontFamily: 'Orbitron, sans-serif', 
              fontWeight: '600',
              textShadow: '0 0 10px rgba(255, 255, 255, 0.3), 0 0 20px rgba(255, 255, 255, 0.1)',
            }}
          >
            <span className="relative z-10">Services</span>
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-orange-600/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"></div>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-600 group-hover:w-full transition-all duration-300"></span>
          </Link>
          
          <Link 
            href="/pricing" 
            className="relative text-white hover:text-orange-400 transition-all duration-300 text-lg font-semibold group overflow-hidden px-2 py-1"
            style={{ 
              fontFamily: 'Orbitron, sans-serif', 
              fontWeight: '600',
              textShadow: '0 0 10px rgba(255, 255, 255, 0.3), 0 0 20px rgba(255, 255, 255, 0.1)',
            }}
          >
            <span className="relative z-10">Pricing</span>
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-orange-600/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"></div>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-600 group-hover:w-full transition-all duration-300"></span>
          </Link>
          
          <Link 
            href="/contact" 
            className="relative text-white hover:text-orange-400 transition-all duration-300 text-lg font-semibold group overflow-hidden px-2 py-1"
            style={{ 
              fontFamily: 'Orbitron, sans-serif', 
              fontWeight: '600',
              textShadow: '0 0 10px rgba(255, 255, 255, 0.3), 0 0 20px rgba(255, 255, 255, 0.1)',
            }}
          >
            <span className="relative z-10">Contact us</span>
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-orange-600/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"></div>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-600 group-hover:w-full transition-all duration-300"></span>
          </Link>
          
          <Link 
            href="/download" 
            className="relative text-white hover:text-orange-400 transition-all duration-300 text-lg font-semibold group overflow-hidden px-2 py-1"
            style={{ 
              fontFamily: 'Orbitron, sans-serif', 
              fontWeight: '600',
              textShadow: '0 0 10px rgba(255, 255, 255, 0.3), 0 0 20px rgba(255, 255, 255, 0.1)',
            }}
          >
            <span className="relative z-10">Download</span>
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-orange-600/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"></div>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-600 group-hover:w-full transition-all duration-300"></span>
          </Link>
        </nav>

        {/* Desktop Login/Profile */}
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
        <div className="fixed left-0 right-0 z-[10001] lg:hidden" style={{ top: `calc(${navbarTop} + 64px)` }}>
          <div className="mx-4 rounded-lg bg-black/90 backdrop-blur-md border border-white/20 shadow-xl shadow-orange-500/10 p-6 space-y-4">
            <Link 
              onClick={() => setMobileNavOpen(false)} 
              href="/" 
              className="relative block text-white hover:text-orange-400 transition-all duration-300 text-base font-semibold py-2 border-b border-white/10 hover:border-orange-500/50 overflow-hidden group"
              style={{ 
                fontFamily: 'Orbitron, sans-serif', 
                fontWeight: '600',
              }}
            >
              <span className="relative z-10">Home</span>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-orange-600/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"></div>
            </Link>
            <Link 
              onClick={() => setMobileNavOpen(false)} 
              href="/#about-us" 
              className="relative block text-white hover:text-orange-400 transition-all duration-300 text-base font-semibold py-2 border-b border-white/10 hover:border-orange-500/50 overflow-hidden group"
              style={{ 
                fontFamily: 'Orbitron, sans-serif', 
                fontWeight: '600',
              }}
            >
              <span className="relative z-10">About us</span>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-orange-600/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"></div>
            </Link>
            <Link 
              onClick={() => setMobileNavOpen(false)} 
              href="/#why-choose" 
              className="relative block text-white hover:text-orange-400 transition-all duration-300 text-base font-semibold py-2 border-b border-white/10 hover:border-orange-500/50 overflow-hidden group"
              style={{ 
                fontFamily: 'Orbitron, sans-serif', 
                fontWeight: '600',
              }}
            >
              <span className="relative z-10">Services</span>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-orange-600/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"></div>
            </Link>
            <Link 
              onClick={() => setMobileNavOpen(false)} 
              href="/pricing" 
              className="relative block text-white hover:text-orange-400 transition-all duration-300 text-base font-semibold py-2 border-b border-white/10 hover:border-orange-500/50 overflow-hidden group"
              style={{ 
                fontFamily: 'Orbitron, sans-serif', 
                fontWeight: '600',
              }}
            >
              <span className="relative z-10">Pricing</span>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-orange-600/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"></div>
            </Link>
            <Link 
              onClick={() => setMobileNavOpen(false)} 
              href="/contact" 
              className="relative block text-white hover:text-orange-400 transition-all duration-300 text-base font-semibold py-2 border-b border-white/10 hover:border-orange-500/50 overflow-hidden group"
              style={{ 
                fontFamily: 'Orbitron, sans-serif', 
                fontWeight: '600',
              }}
            >
              <span className="relative z-10">Contact us</span>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-orange-600/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"></div>
            </Link>
            <Link 
              onClick={() => setMobileNavOpen(false)} 
              href="/download" 
              className="relative block text-white hover:text-orange-400 transition-all duration-300 text-base font-semibold py-2 overflow-hidden group"
              style={{ 
                fontFamily: 'Orbitron, sans-serif', 
                fontWeight: '600',
              }}
            >
              <span className="relative z-10">Download</span>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-orange-600/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"></div>
            </Link>
          </div>
        </div>
      )}
    </>
  )
}


