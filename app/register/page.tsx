"use client"

import { useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/components/auth-context'

export const dynamic = 'force-dynamic'

function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { openRegisterModal } = useAuth()

  useEffect(() => {
    // Check for error query parameter (from Google OAuth)
    const error = searchParams.get('error')
    if (error) {
      // Redirect to home and open register modal with error
      router.replace('/')
      // Small delay to ensure modal context is ready
      setTimeout(() => {
        openRegisterModal()
      }, 100)
    } else {
      // Just redirect to home and open register modal
      router.replace('/')
      setTimeout(() => {
        openRegisterModal()
      }, 100)
    }
  }, [router, searchParams, openRegisterModal])

  return (
    <div className="h-[95vh] flex items-center justify-center">
      <div className="text-white">Redirecting...</div>
    </div>
  )
}

export default function RegisterPageWrapper() {
  return (
    <Suspense fallback={
      <div className="h-[95vh] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <RegisterPage />
    </Suspense>
  )
}
