"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Edit2, CreditCard, Bell, HelpCircle, LogOut } from "lucide-react"
import { SharedNavbar } from "@/components/shared-navbar"
import Cookies from 'js-cookie'
import apiClient from '@/lib/api/client'
import { logoutUser } from '@/lib/api'
import { ProfileTab } from "@/components/profile/profile-tab"
import { EditProfileTab } from "@/components/profile/edit-profile-tab"
import { SubscriptionTab } from "@/components/profile/subscription-tab"
import { NotificationsTab } from "@/components/profile/notifications-tab"
import { SupportTab } from "@/components/profile/support-tab"

export const dynamic = 'force-dynamic'

interface UserInfo {
  email?: string
  name?: string
  firstName?: string
  lastName?: string
  phone?: string
  address?: string
  city?: string
  postcode?: string
  dateOfBirth?: string
  nationalId?: string
  title?: string
  hireDate?: string
}

interface EditProfileForm {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  postcode: string
  dateOfBirth: string
  nationalId: string
  title: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('profile')
  const [logoutProgress, setLogoutProgress] = useState(0)
  const [isHoldingLogout, setIsHoldingLogout] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const logoutIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const logoutStartTimeRef = useRef<number | null>(null)
  const HOLD_DURATION = 2000 // 2 seconds
  const [editForm, setEditForm] = useState<EditProfileForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postcode: '',
    dateOfBirth: '',
    nationalId: '',
    title: ''
  })

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true)
        const email = Cookies.get('userEmail')
        const name = Cookies.get('userName')
        
        try {
          const response = await apiClient.get('/api/users/me')
          const userData = response.data?.data?.user || response.data?.data
          if (userData) {
            setUserInfo({
              email: userData.email || email,
              name: userData.firstName && userData.lastName 
                ? `${userData.firstName} ${userData.lastName}` 
                : name,
              firstName: userData.firstName,
              lastName: userData.lastName,
              phone: userData.phone,
              address: userData.address,
              city: userData.city,
              postcode: userData.postcode,
              dateOfBirth: userData.dateOfBirth,
              nationalId: userData.nationalId,
              title: userData.title,
              hireDate: userData.hireDate
            })
            setEditForm({
              firstName: userData.firstName || '',
              lastName: userData.lastName || '',
              email: userData.email || email || '',
              phone: userData.phone || '',
              address: userData.address || '',
              city: userData.city || '',
              postcode: userData.postcode || '',
              dateOfBirth: userData.dateOfBirth || '',
              nationalId: userData.nationalId || '',
              title: userData.title || ''
            })
          } else {
            setUserInfo({
              email: email,
              name: name
            })
            setEditForm({
              firstName: name?.split(' ')[0] || '',
              lastName: name?.split(' ').slice(1).join(' ') || '',
              email: email || '',
              phone: '',
              address: '',
              city: '',
              postcode: '',
              dateOfBirth: '',
              nationalId: '',
              title: ''
            })
          }
        } catch (error) {
          console.error('[Profile] Error fetching user data:', error)
          setUserInfo({
            email: email,
            name: name
          })
          setEditForm({
            firstName: name?.split(' ')[0] || '',
            lastName: name?.split(' ').slice(1).join(' ') || '',
            email: email || '',
            phone: '',
            address: '',
            city: '',
            postcode: '',
            dateOfBirth: '',
            nationalId: '',
            title: ''
          })
        }
      } catch (error) {
        console.error('[Profile] Error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [])

  const handleRefresh = () => {
    window.location.reload()
  }

  const startLogoutHold = () => {
    setIsHoldingLogout(true)
    setLogoutProgress(0)
    logoutStartTimeRef.current = Date.now()
    
    logoutIntervalRef.current = setInterval(() => {
      if (logoutStartTimeRef.current) {
        const elapsed = Date.now() - logoutStartTimeRef.current
        const newProgress = Math.min((elapsed / HOLD_DURATION) * 100, 100)
        setLogoutProgress(newProgress)
        
        if (elapsed >= HOLD_DURATION) {
          performLogout()
        }
      }
    }, 16) // ~60fps
  }

  const stopLogoutHold = () => {
    setIsHoldingLogout(false)
    setLogoutProgress(0)
    if (logoutIntervalRef.current) {
      clearInterval(logoutIntervalRef.current)
      logoutIntervalRef.current = null
    }
    logoutStartTimeRef.current = null
  }

  const performLogout = async () => {
    stopLogoutHold()
    try {
      await logoutUser()
      Cookies.remove('accessToken', { path: '/' })
      Cookies.remove('refreshToken', { path: '/' })
      Cookies.remove('isAuthenticated', { path: '/' })
      Cookies.remove('userEmail', { path: '/' })
      Cookies.remove('userName', { path: '/' })
      router.push('/')
    } catch (error) {
      console.error('[Logout] Error:', error)
      Cookies.remove('accessToken', { path: '/' })
      Cookies.remove('refreshToken', { path: '/' })
      Cookies.remove('isAuthenticated', { path: '/' })
      Cookies.remove('userEmail', { path: '/' })
      Cookies.remove('userName', { path: '/' })
      router.push('/')
    }
  }

  useEffect(() => {
    return () => {
      if (logoutIntervalRef.current) {
        clearInterval(logoutIntervalRef.current)
      }
    }
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a]">
        <SharedNavbar />
        <div className="flex-1 flex items-center justify-center pt-24">
          <div className="text-white text-xl">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a] text-white">
      <SharedNavbar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 max-w-7xl pt-24">
        {/* Header */}
        <div className="mb-8 lg:mb-12">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              onClick={() => router.push('/')}
              className="text-gray-400 hover:text-white hover:bg-orange-500/10 border border-orange-500/20 rounded-lg px-4 py-2 transition-all duration-200"
            >
              ← Back
            </Button>
          </div>
          
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-[#1a1a1a]/80 backdrop-blur-sm border border-orange-500/20 p-1.5 rounded-xl mb-8 lg:mb-12 h-auto flex-wrap gap-2">
            <TabsTrigger 
              value="profile" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-orange-600 data-[state=active]:text-white text-gray-400 hover:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-orange-500/30 transition-all duration-200 px-4 py-2.5 rounded-lg font-medium text-sm"
            >
              <User className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger 
              value="edit-profile"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-orange-600 data-[state=active]:text-white text-gray-400 hover:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-orange-500/30 transition-all duration-200 px-4 py-2.5 rounded-lg font-medium text-sm"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Edit Profile</span>
            </TabsTrigger>
            <TabsTrigger 
              value="subscription"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-orange-600 data-[state=active]:text-white text-gray-400 hover:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-orange-500/30 transition-all duration-200 px-4 py-2.5 rounded-lg font-medium text-sm"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Subscription</span>
            </TabsTrigger>
            <TabsTrigger 
              value="notifications"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-orange-600 data-[state=active]:text-white text-gray-400 hover:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-orange-500/30 transition-all duration-200 px-4 py-2.5 rounded-lg font-medium text-sm"
            >
              <Bell className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger 
              value="support"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-orange-600 data-[state=active]:text-white text-gray-400 hover:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-orange-500/30 transition-all duration-200 px-4 py-2.5 rounded-lg font-medium text-sm"
            >
              <HelpCircle className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Support</span>
            </TabsTrigger>
            <div className="relative inline-block group">
              <TabsTrigger 
                value="logout"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => {
                  setShowTooltip(false)
                  stopLogoutHold()
                }}
                onMouseDown={(e) => {
                  e.preventDefault()
                  startLogoutHold()
                }}
                onMouseUp={stopLogoutHold}
                onTouchStart={(e) => {
                  e.preventDefault()
                  startLogoutHold()
                }}
                onTouchEnd={stopLogoutHold}
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-red-600 data-[state=active]:text-white text-gray-400 hover:text-red-400 data-[state=active]:shadow-lg data-[state=active]:shadow-red-500/30 transition-all duration-200 px-4 py-2.5 rounded-lg font-medium text-sm relative overflow-hidden cursor-pointer"
              >
                <div className="relative z-10 flex items-center">
                  <LogOut className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Logout</span>
                  {isHoldingLogout && (
                    <span className="ml-2 text-xs font-semibold">
                      {Math.round(logoutProgress)}%
                    </span>
                  )}
                </div>
                {isHoldingLogout && (
                  <div 
                    className="absolute inset-0 bg-red-500/20 transition-all duration-100"
                    style={{ 
                      width: `${logoutProgress}%`,
                      transition: 'width 0.1s linear'
                    }}
                  />
                )}
              </TabsTrigger>
              
              {/* Custom Tooltip */}
              {showTooltip && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50 animate-in fade-in-0 zoom-in-95 duration-200">
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-2 border-orange-400/50 shadow-xl shadow-orange-500/30 px-4 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap backdrop-blur-sm" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}>
                    <p>Hold for 2 seconds to logout</p>
                    {/* Tooltip Arrow */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-px">
                      <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-orange-600 border-r-2 border-b-2 border-orange-400/50 transform rotate-45"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="mt-0">
            <ProfileTab userInfo={userInfo} />
          </TabsContent>

          {/* Edit Profile Tab */}
          <TabsContent value="edit-profile" className="mt-0">
            <EditProfileTab initialForm={editForm} onSuccess={handleRefresh} />
          </TabsContent>

          {/* Subscription Tab */}
          <TabsContent value="subscription" className="mt-0">
            <SubscriptionTab />
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="mt-0">
            <NotificationsTab />
          </TabsContent>

          {/* Support Tab */}
          <TabsContent value="support" className="mt-0">
            <SupportTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
