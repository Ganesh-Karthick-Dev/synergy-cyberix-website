"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"

interface ProfileDropdownProps {
  userEmail?: string
  userName?: string
  userInitials?: string
}

export function ProfileDropdown({ userEmail, userName, userInitials }: ProfileDropdownProps) {
  const router = useRouter()
  
  // Get user info from cookies or props
  const displayName = userName || userEmail?.split('@')[0] || 'User'
  const initials = userInitials || displayName.charAt(0).toUpperCase()

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
      <span className="relative z-10 hidden xl:block text-sm font-semibold text-white group-hover:text-orange-100 transition-colors duration-300 uppercase tracking-wide">
        {displayName}
      </span>
    </button>
  )
}

