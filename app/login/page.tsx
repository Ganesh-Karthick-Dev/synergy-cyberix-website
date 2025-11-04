"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { useMutation } from '@tanstack/react-query'
import { loginUser } from '@/lib/api'
import type { ApiError } from '@/lib/api/types'

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  // Login mutation with TanStack Query
  const loginMutation = useMutation({
    mutationFn: (credentials: { email: string; password: string }) => {
      return loginUser(credentials)
    },
    onSuccess: (data) => {
      console.log('[Login] Success:', data)
      // Token is already saved in cookies by loginUser function
      // Verify token is in cookie
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('accessToken='))
      
      if (token) {
        console.log('[Login] Access token confirmed in cookie')
        // Redirect to home page
        window.location.href = '/'
      } else {
        setFieldErrors({ general: 'Login successful but token not saved. Please try again.' })
      }
    },
    onError: (error: any) => {
      console.error('[Login] Error:', error)
      
      if (error.response) {
        const errorData: ApiError = error.response.data
        
        // Handle field-specific errors from API
        if (errorData?.errors && typeof errorData.errors === 'object') {
          const apiErrors: Record<string, string> = {}
          const errors = errorData.errors
          Object.keys(errors).forEach((key) => {
            const errorValue = errors[key]
            apiErrors[key] = Array.isArray(errorValue) 
              ? errorValue[0] 
              : String(errorValue)
          })
          setFieldErrors(apiErrors)
        } else if (errorData?.message) {
          if (errorData.field) {
            setFieldErrors({ [errorData.field]: errorData.message })
          } else {
            setFieldErrors({ general: errorData.message })
          }
        } else {
          setFieldErrors({ general: error.response?.status === 401 
            ? 'Invalid email or password. Please try again.' 
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
    <div className="h-[95vh] md:h-[95vh] flex flex-col md:flex-row items-center md:items-stretch justify-center md:justify-start p-2 md:p-4 lg:p-6 md:overflow-hidden">
      {/* Mobile Header */}
      <div className="md:hidden w-full max-w-md bg-gradient-to-r from-orange-900 via-orange-800 to-black py-4 px-6 flex items-center justify-between rounded-t-2xl">
        <div className="text-xl font-bold text-white tracking-wide">
          CYBERIX
        </div>
        <Button
          onClick={() => window.location.href = '/'}
          className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1.5 rounded-full text-xs font-medium"
        >
          Back →
        </Button>
      </div>

      {/* Left Section - Visual/Promotional (40%) */}
      <div 
        className="hidden md:flex md:w-[40%] relative overflow-hidden rounded-2xl md:rounded-l-2xl md:rounded-r-none"
        style={{
          backgroundImage: "url('/hero/middle-1.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      >
        {/* Gradient Overlay - Orange tones */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/90 via-orange-800/70 to-black/95 rounded-2xl md:rounded-l-2xl md:rounded-r-none"></div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-8 md:p-10 lg:p-12 w-full">
          {/* Top Section */}
          <div className="flex items-start justify-between">
            {/* Logo */}
            <div className="h-12 md:h-16 w-auto flex items-center">
              <img 
                src="/Cybersecurity research-01.png" 
                alt="Cyberix Logo" 
                className="h-full w-auto brightness-0 invert"
              />
            </div>
            
            {/* Back Button */}
            <Button
              onClick={() => window.location.href = '/'}
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-full text-sm font-medium"
            >
              Back to website →
            </Button>
          </div>

          {/* Bottom Section */}
          <div className="flex flex-col items-center mb-12">
            {/* Tagline */}
            <p className="text-white text-xl md:text-2xl font-medium mb-8 text-center">
              Protecting Businesses, Securing Futures
            </p>
            
            {/* Pagination Dots */}
            <div className="flex gap-2">
              <div className="w-10 h-1 bg-white/30 rounded-full"></div>
              <div className="w-10 h-1 bg-white/80 rounded-full"></div>
              <div className="w-10 h-1 bg-white/30 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Login Form (60%) */}
      <div className="w-full md:w-[60%] bg-[#1a1a1a] flex items-center md:items-center justify-center p-0 md:p-5 lg:p-6 rounded-t-none rounded-b-2xl md:rounded-r-2xl md:rounded-l-none md:rounded-br-2xl md:overflow-y-auto">
        <div className="w-full max-w-md px-6 md:px-5 lg:px-6 py-3 md:py-0 flex-1 md:flex-none">
          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1 md:mb-1">
            Log in
          </h1>

          {/* Register Prompt */}
          <p className="text-gray-400 mb-3 md:mb-4 text-sm">
            Don't have an account?{" "}
            <a href="/register" className="text-orange-400 hover:text-orange-300 font-medium">
              Create an account
            </a>
          </p>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-2.5 md:space-y-3">
            {/* Email */}
            <div>
              <Input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className={`bg-[#2a2a2a] text-white placeholder-gray-500 focus:border-orange-500 rounded-lg h-10 text-sm border focus:ring-1 focus:ring-orange-500 ${
                  fieldErrors.email ? 'border-red-500' : 'border-orange-500/40'
                }`}
                placeholder="Email"
              />
              {fieldErrors.email && (
                <p className="text-red-400 text-xs mt-1 ml-1">{fieldErrors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="relative">
              <Input
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={handleInputChange}
                className={`bg-[#2a2a2a] text-white placeholder-gray-500 focus:border-orange-500 rounded-lg h-10 pr-12 text-sm border focus:ring-1 focus:ring-orange-500 ${
                  fieldErrors.password ? 'border-red-500' : 'border-orange-500/40'
                }`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-400"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              {fieldErrors.password && (
                <p className="text-red-400 text-xs mt-1 ml-1">{fieldErrors.password}</p>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <a href="/forgot-password" className="text-sm text-orange-400 hover:text-orange-300 font-medium">
                Forgot password?
              </a>
            </div>

            {/* General Error Message */}
            {fieldErrors.general && (
              <div className="text-red-400 text-sm text-center">
                {fieldErrors.general}
              </div>
            )}

            {/* Login Button */}
            <Button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loginMutation.isPending ? 'Logging in...' : 'Log in'}
            </Button>
          </form>

          {/* Separator */}
          <div className="relative my-3 md:my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[#1a1a1a] text-gray-500">Or login with</span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-1.5 md:space-y-2">
            {/* Google Button */}
            <Button
              type="button"
              variant="outline"
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
              Google
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

