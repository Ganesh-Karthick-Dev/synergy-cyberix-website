"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Cookies from 'js-cookie'
import apiClient from '@/lib/api/client'

interface ProfileDropdownProps {
  userEmail?: string
  userName?: string
  userInitials?: string
}

export function ProfileDropdown({ userEmail, userName, userInitials }: ProfileDropdownProps) {
  const router = useRouter()
  const [displayName, setDisplayName] = useState<string>('User')
  const [initials, setInitials] = useState<string>('U')
  const [hasFetched, setHasFetched] = useState(false)
  
  // Get user info from cookies, props, or API
  useEffect(() => {
    const updateUserInfo = async () => {
      // First, try props or cookies
      const cookieName = Cookies.get('userName')
      const cookieEmail = Cookies.get('userEmail')
      const isAuthenticated = Cookies.get('isAuthenticated') === 'true'
      
      let name = userName || cookieName
      
      // If we have a name from props or cookies, use it
      if (name) {
        setDisplayName(name)
        setInitials(userInitials || name.charAt(0).toUpperCase())
        return
      }
      
      // If authenticated but no name in cookies, try fetching from API
      if (isAuthenticated && !hasFetched) {
        try {
          const response = await apiClient.get('/api/auth/profile')
          const userData = response.data?.data
          
          if (userData) {
            const fullName = userData.firstName && userData.lastName
              ? `${userData.firstName} ${userData.lastName}`
              : userData.firstName || userData.email?.split('@')[0] || 'User'
            
            setDisplayName(fullName)
            setInitials(userInitials || fullName.charAt(0).toUpperCase())
            
            // Update cookies for future use
            if (fullName && fullName !== 'User') {
              Cookies.set('userName', fullName, { path: '/', expires: 7 })
            }
            if (userData.email) {
              Cookies.set('userEmail', userData.email, { path: '/', expires: 7 })
            }
            
            setHasFetched(true)
            return
          }
        } catch (error) {
          console.error('[ProfileDropdown] Error fetching user profile:', error)
        }
      }
      
      // Fallback to email or default
      const fallbackName = userEmail || cookieEmail?.split('@')[0] || 'User'
      setDisplayName(fallbackName)
      setInitials(userInitials || fallbackName.charAt(0).toUpperCase())
    }

    updateUserInfo()
    // Check cookies periodically (less frequent than before)
    const interval = setInterval(updateUserInfo, 2000)
    return () => clearInterval(interval)
  }, [userName, userEmail, userInitials, hasFetched])

  const handleProfileClick = () => {
    router.push('/profile')
  }

  return (
    <button
      onClick={handleProfileClick}
      className="group relative flex items-center gap-3 px-4 py-2.5 rounded-lg bg-gradient-to-r from-gray-900/95 via-gray-800/95 to-gray-900/95 text-white border border-orange-500/40 hover:border-orange-500/60 transition-all duration-300 shadow-lg shadow-orange-500/10 hover:shadow-xl hover:shadow-orange-500/20 backdrop-blur-sm"
      style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}
    >
      {/* Orange glow effect on hover */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-orange-500/0 via-orange-500/5 to-orange-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Avatar */}
      <div className="relative z-10">
        <Avatar className="h-10 w-10 ring-2 ring-orange-500/30 group-hover:ring-orange-500/50 transition-all duration-300">
          <AvatarFallback className="bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 text-white font-bold text-base shadow-lg shadow-orange-500/30 group-hover:shadow-orange-500/50 transition-all duration-300">
            {initials}
          </AvatarFallback>
        </Avatar>
      </div>
      
      {/* User Name */}
      <span className="relative z-10 hidden xl:block text-sm font-semibold text-white group-hover:text-orange-100 transition-colors duration-300 tracking-wide">
        {displayName}
      </span>
    </button>
  )
}

