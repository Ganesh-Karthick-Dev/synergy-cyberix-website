"use client"

import { useEffect, useState } from 'react'
import { X, Bell, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

/**
 * Notification Permission Alert Component
 * Shows a one-time professional alert if browser notifications are disabled
 * Only displays once per user (tracked via localStorage)
 */
export function NotificationPermissionAlert() {
  const [showAlert, setShowAlert] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // Only check on client side
    if (typeof window === 'undefined') return

    // Check if alert has been shown before
    const alertShown = localStorage.getItem('notification-permission-alert-shown')
    if (alertShown === 'true') {
      setIsChecking(false)
      return
    }

    // Check notification permission status
    const checkPermission = () => {
      if (!('Notification' in window)) {
        // Browser doesn't support notifications
        setIsChecking(false)
        return
      }

      const permission = Notification.permission
      
      // Only show alert if permission is denied (not default, as user hasn't been asked yet)
      if (permission === 'denied') {
        setShowAlert(true)
      }
      
      setIsChecking(false)
    }

    // Small delay to ensure page is loaded
    const timer = setTimeout(checkPermission, 1000)
    
    return () => clearTimeout(timer)
  }, [])

  const handleDismiss = () => {
    setShowAlert(false)
    // Mark as shown so it doesn't appear again
    localStorage.setItem('notification-permission-alert-shown', 'true')
  }

  const handleEnableNotifications = async () => {
    try {
      if ('Notification' in window && Notification.permission === 'denied') {
        // Permission is denied, guide user to browser settings
        alert(
          'To enable notifications:\n\n' +
          '1. Click the lock/info icon in your browser\'s address bar\n' +
          '2. Find "Notifications" in the permissions list\n' +
          '3. Change it to "Allow"\n' +
          '4. Refresh this page'
        )
      } else if ('Notification' in window) {
        // Try to request permission
        const permission = await Notification.requestPermission()
        if (permission === 'granted') {
          setShowAlert(false)
          localStorage.setItem('notification-permission-alert-shown', 'true')
        }
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error)
    }
  }

  if (isChecking || !showAlert) {
    return null
  }

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] w-full max-w-md px-4 animate-in slide-in-from-bottom-5 fade-in-0 duration-300">
      <div className="relative bg-gradient-to-br from-orange-600/95 to-orange-700/95 backdrop-blur-sm border border-orange-500/50 rounded-xl shadow-2xl p-5 space-y-4">
        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-white/80 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50"
          aria-label="Dismiss alert"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon and Title */}
        <div className="flex items-start gap-3 pr-8">
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
            <Bell className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 space-y-2">
            <h3 className="text-white font-semibold text-base leading-tight">
              Browser Notifications Disabled
            </h3>
            <p className="text-white/90 text-sm leading-relaxed">
              Enable browser notifications to receive important updates, security alerts, and real-time notifications from Cyberix.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={handleEnableNotifications}
            className="flex-1 bg-white text-orange-600 hover:bg-white/90 font-medium text-sm py-2.5 px-4 rounded-md transition-all duration-200 shadow-lg hover:shadow-xl border-0 focus:outline-none focus:ring-2 focus:ring-white/50"
            style={{ color: '#ea580c' }}
          >
            Enable Notifications
          </button>
          <button
            onClick={handleDismiss}
            className="bg-transparent border-2 border-white/40 text-white hover:bg-white/10 hover:border-white/60 font-medium text-sm py-2.5 px-4 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
            style={{ color: '#ffffff' }}
          >
            Dismiss
          </button>
        </div>

        {/* Info Note */}
        <div className="flex items-start gap-2 pt-2 border-t border-white/20">
          <AlertCircle className="w-4 h-4 text-white/70 mt-0.5 flex-shrink-0" />
          <p className="text-white/70 text-xs leading-relaxed">
            You can enable notifications anytime from your browser settings. This alert will not appear again.
          </p>
        </div>
      </div>
    </div>
  )
}

