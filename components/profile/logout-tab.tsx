"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { logoutUser } from '@/lib/api'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'

export function LogoutTab() {
  const router = useRouter()
  const [isHolding, setIsHolding] = useState(false)
  const [progress, setProgress] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const HOLD_DURATION = 2000 // 2 seconds

  const startHold = () => {
    setIsHolding(true)
    setProgress(0)
    startTimeRef.current = Date.now()
    
    intervalRef.current = setInterval(() => {
      if (startTimeRef.current) {
        const elapsed = Date.now() - startTimeRef.current
        const newProgress = Math.min((elapsed / HOLD_DURATION) * 100, 100)
        setProgress(newProgress)
        
        if (elapsed >= HOLD_DURATION) {
          handleLogout()
        }
      }
    }, 16) // ~60fps
  }

  const stopHold = () => {
    setIsHolding(false)
    setProgress(0)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    startTimeRef.current = null
  }

  const handleLogout = async () => {
    stopHold()
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
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const circumference = 2 * Math.PI * 36 // radius = 36
  const offset = circumference - (progress / 100) * circumference

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-white" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '700' }}>
            Hold to Logout
          </h3>
          <p className="text-gray-400 text-sm">
            Press and hold the button for 2 seconds to sign out
          </p>
        </div>

        <div className="relative inline-flex items-center justify-center">
          {/* Circular Progress Background */}
          <svg className="transform -rotate-90 w-24 h-24">
            <circle
              cx="48"
              cy="48"
              r="36"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              className="text-gray-800"
            />
            <circle
              cx="48"
              cy="48"
              r="36"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="text-red-500 transition-all duration-100 ease-linear"
            />
          </svg>

          {/* Button */}
          <Button
            onMouseDown={startHold}
            onMouseUp={stopHold}
            onMouseLeave={stopHold}
            onTouchStart={startHold}
            onTouchEnd={stopHold}
            className={`absolute w-20 h-20 rounded-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-semibold transition-all duration-200 shadow-lg ${
              isHolding 
                ? 'scale-95 shadow-red-500/50 ring-4 ring-red-500/30' 
                : 'scale-100 hover:shadow-red-500/50'
            }`}
            style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}
          >
            <LogOut className="w-6 h-6" />
          </Button>
        </div>

        {isHolding && (
          <div className="text-center">
            <p className="text-red-400 text-sm font-medium">
              {Math.round(progress)}% - Keep holding...
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

