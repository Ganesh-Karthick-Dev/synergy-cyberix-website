"use client"

import { useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/components/auth-context'

function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { openLoginModal } = useAuth()

  useEffect(() => {
    // Check for error query parameter (from Google OAuth)
    const error = searchParams.get('error')
    if (error) {
      // Redirect to home and open login modal with error
      router.replace('/')
      // Small delay to ensure modal context is ready
      setTimeout(() => {
        openLoginModal()
      }, 100)
    } else {
      // Just redirect to home and open login modal
      router.replace('/')
      setTimeout(() => {
        openLoginModal()
      }, 100)
    }
  }, [router, searchParams, openLoginModal])

  return (
    <div className="h-[95vh] flex items-center justify-center">
      <div className="text-white">Redirecting...</div>
    </div>
  )
}

export default function LoginPageWrapper() {
  return (
    <Suspense fallback={
      <div className="h-[95vh] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <LoginPage />
    </Suspense>
  )
}

