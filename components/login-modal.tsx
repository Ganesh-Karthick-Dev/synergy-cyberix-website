"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff } from "lucide-react"
import { useState, useEffect } from "react"
import { useMutation } from '@tanstack/react-query'
import { loginUser, API_CONFIG } from '@/lib/api'
import type { ApiError } from '@/lib/api/types'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAuth } from "@/components/auth-context"
import { useSearchParams } from 'next/navigation'
import { AuthCarousel } from "@/components/auth-carousel"

export function LoginModal() {
  const { isLoginModalOpen, closeLoginModal, switchToRegister } = useAuth()
  const searchParams = useSearchParams()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  // Reset form when modal opens and check for error from Google OAuth
  useEffect(() => {
    if (isLoginModalOpen) {
      setFormData({ email: '', password: '' })
      setFieldErrors({})
      setShowPassword(false)
      
      // Check for error query parameter (from Google OAuth redirect)
      const error = searchParams.get('error')
      if (error) {
        setFieldErrors({ general: decodeURIComponent(error) })
        // Remove error from URL to clean it up
        if (typeof window !== 'undefined') {
          const url = new URL(window.location.href)
          url.searchParams.delete('error')
          window.history.replaceState({}, '', url.toString())
        }
      }
    }
  }, [isLoginModalOpen, searchParams])

  // Handle Google login - use website-specific route
  const handleGoogleLogin = () => {
    const apiBaseUrl = API_CONFIG.BASE_URL
    const googleLoginUrl = `${apiBaseUrl}/api/auth/google/website`
    window.location.href = googleLoginUrl
  }

  // Login mutation with TanStack Query
  const loginMutation = useMutation({
    mutationFn: (credentials: { email: string; password: string }) => {
      return loginUser(credentials)
    },
    onSuccess: (data) => {
      console.log('[Login] Success:', data)
      // Close modal
      closeLoginModal()
      // Reload page to update auth state
      setTimeout(() => {
        window.location.reload()
      }, 100)
    },
    onError: (error: any) => {
      console.error('[Login] Error:', error)
      
      if (error.response) {
        const responseData = error.response.data
        
        if (responseData?.error) {
          const errorInfo = responseData.error
          setFieldErrors({ general: errorInfo.message || 'Login failed. Please try again.' })
        } else if (responseData?.errors && typeof responseData.errors === 'object') {
          const apiErrors: Record<string, string> = {}
          const errors = responseData.errors
          Object.keys(errors).forEach((key) => {
            const errorValue = errors[key]
            apiErrors[key] = Array.isArray(errorValue) 
              ? errorValue[0] 
              : String(errorValue)
          })
          setFieldErrors(apiErrors)
        } else if (responseData?.message) {
          setFieldErrors({ general: responseData.message })
        } else {
          setFieldErrors({ general: error.response?.status === 401 
            ? 'Invalid email or password. Please try again.' 
            : error.response?.status === 423
            ? 'Account temporarily blocked due to multiple failed login attempts. Please try again later.'
            : 'Login failed. Please try again.' 
          })
        }
      } else {
        setFieldErrors({ general: 'Login failed. Please check your connection and try again.' })
      }
    }
  })

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'email':
        if (!value.trim()) return 'Email is required'
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) return 'Please enter a valid email address'
        return ''
      case 'password':
        if (!value) return 'Password is required'
        if (value.length < 6) return 'Password must be at least 6 characters'
        return ''
      default:
        return ''
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    
    setFormData({
      ...formData,
      [name]: value
    })

    // Clear error for this field when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors({
        ...fieldErrors,
        [name]: ''
      })
    }
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key as keyof typeof formData])
      if (error) {
        errors[key] = error
      }
    })

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Clear previous errors
    setFieldErrors({})

    // Validate form
    if (!validateForm()) {
      return
    }

    // Call login mutation
    loginMutation.mutate({
      email: formData.email.trim(),
      password: formData.password
    })
  }

  return (
    <Dialog open={isLoginModalOpen} onOpenChange={closeLoginModal}>
      <DialogContent 
        showCloseButton={true}
        className="!max-w-none !sm:max-w-none !md:max-w-none w-[90%] md:w-[80%] h-[90vh] md:h-[80vh] p-0 bg-transparent border-none shadow-none overflow-hidden"
      >
        <div className="relative flex flex-col md:flex-row h-full rounded-2xl overflow-hidden">
          {/* Close Button */}
          <button
            onClick={closeLoginModal}
            className="absolute top-4 right-4 z-50 rounded-full bg-black/50 hover:bg-black/70 text-white p-2 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-orange-500"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          {/* Left Section - Carousel (40%) */}
          <div className="hidden md:flex md:w-[40%] h-full">
            <AuthCarousel className="w-full h-full" />
          </div>

          {/* Right Section - Login Form (60%) */}
          <div className="w-full md:w-[60%] bg-[#1a1a1a] flex flex-col justify-center p-6 md:p-8 lg:p-12 overflow-y-auto">
            <div className="w-full max-w-md mx-auto">
              <DialogHeader className="mb-6 text-left">
                <DialogTitle className="text-3xl md:text-4xl font-bold text-white mb-2" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '700' }}>
                  Log in
                </DialogTitle>
              </DialogHeader>

              {/* Register Prompt */}
              <p className="text-gray-400 mb-8 text-sm">
                Don't have an account?{" "}
                <button 
                  onClick={switchToRegister}
                  className="text-orange-400 hover:text-orange-300 font-medium transition-colors"
                >
                  Create an account
                </button>
              </p>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-sm text-gray-300 font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`bg-[#2a2a2a] text-white placeholder-gray-500 focus:border-orange-500 rounded-lg h-12 text-sm border-2 transition-colors focus:ring-2 focus:ring-orange-500/50 ${
                      fieldErrors.email ? 'border-red-500' : 'border-orange-500/30 hover:border-orange-500/50'
                    }`}
                    placeholder="Enter your email"
                  />
                  {fieldErrors.email && (
                    <p className="text-red-400 text-xs mt-1">{fieldErrors.email}</p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label htmlFor="password" className="text-sm text-gray-300 font-medium">
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`bg-[#2a2a2a] text-white placeholder-gray-500 focus:border-orange-500 rounded-lg h-12 pr-12 text-sm border-2 transition-colors focus:ring-2 focus:ring-orange-500/50 ${
                        fieldErrors.password ? 'border-red-500' : 'border-orange-500/30 hover:border-orange-500/50'
                      }`}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {fieldErrors.password && (
                    <p className="text-red-400 text-xs mt-1">{fieldErrors.password}</p>
                  )}
                </div>

                {/* Forgot Password Link */}
                <div className="flex justify-end -mt-2">
                  <button 
                    type="button"
                    className="text-sm text-orange-400 hover:text-orange-300 font-medium transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* General Error Message */}
                {fieldErrors.general && (
                  <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-3 rounded-lg text-center">
                    {fieldErrors.general}
                  </div>
                )}

                {/* Login Button */}
                <Button
                  type="submit"
                  disabled={loginMutation.isPending}
                  className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white py-3 rounded-lg text-base font-semibold transition-all duration-200 shadow-lg hover:shadow-orange-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                  style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}
                >
                  {loginMutation.isPending ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Logging in...
                    </span>
                  ) : (
                    'Log in'
                  )}
                </Button>
              </form>

              {/* Separator */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-[#1a1a1a] text-gray-500">Or login with</span>
                </div>
              </div>

              {/* Social Login Buttons */}
              <div className="space-y-3">
          {/* Google Button */}
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleLogin}
            className="w-full bg-white hover:bg-gray-100 text-gray-900 border-gray-600 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
              Sign in with Google
            </Button>
          </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

