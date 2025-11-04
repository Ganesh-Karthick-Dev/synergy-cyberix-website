"use client"

import { Button } from "@/components/ui/button"
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
    <Button
      onClick={handleProfileClick}
      variant="ghost"
      className="flex items-center gap-3 px-4 py-2 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-white border border-orange-500/30 transition-all duration-200"
      style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '500' }}
    >
      <Avatar className="h-9 w-9">
        <AvatarFallback className="bg-orange-500 text-white font-semibold text-sm">
          {initials}
        </AvatarFallback>
      </Avatar>
      <span className="hidden xl:block text-sm font-medium">{displayName}</span>
    </Button>
  )
}

