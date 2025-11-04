"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { User, LogOut, Settings } from "lucide-react"
import Cookies from 'js-cookie'
import { logoutUser } from '@/lib/api'

interface ProfileDropdownProps {
  userEmail?: string
  userName?: string
  userInitials?: string
}

export function ProfileDropdown({ userEmail, userName, userInitials }: ProfileDropdownProps) {
  const handleLogout = async () => {
    try {
      await logoutUser()
      // Clear any additional state if needed
      Cookies.remove('accessToken', { path: '/' })
      Cookies.remove('refreshToken', { path: '/' })
      // Redirect to home page
      window.location.href = '/'
    } catch (error) {
      console.error('[Logout] Error:', error)
      // Still clear cookies and redirect even if API call fails
      Cookies.remove('accessToken', { path: '/' })
      Cookies.remove('refreshToken', { path: '/' })
      window.location.href = '/'
    }
  }

  // Get user info from cookies or props
  const displayName = userName || userEmail?.split('@')[0] || 'User'
  const displayEmail = userEmail || 'user@example.com'
  const initials = userInitials || displayName.charAt(0).toUpperCase()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full bg-orange-500 hover:bg-orange-600 text-white cursor-pointer"
          style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}
        >
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-orange-500 text-white font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-[#1a1a1a] border border-orange-500/30" align="end" forceMount>
        <DropdownMenuLabel className="font-normal bg-[#1a1a1a]">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none text-white">{displayName}</p>
            <p className="text-xs leading-none text-gray-400">{displayEmail}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-700" />
        <DropdownMenuItem className="text-white hover:bg-orange-500/20 cursor-pointer">
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="text-white hover:bg-orange-500/20 cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-gray-700" />
        <DropdownMenuItem 
          className="text-red-400 hover:bg-red-500/20 cursor-pointer focus:text-red-400 focus:bg-red-500/20"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

