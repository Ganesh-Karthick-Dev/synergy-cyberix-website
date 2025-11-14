"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useMutation } from '@tanstack/react-query'
import apiClient from '@/lib/api/client'
import Cookies from 'js-cookie'

interface EditProfileForm {
  firstName: string
  lastName: string
  email: string
  phone: string
  companyName: string
  location: string
}

interface EditProfileTabProps {
  initialForm: EditProfileForm
  onSuccess?: () => void
}

export function EditProfileTab({ initialForm, onSuccess }: EditProfileTabProps) {
  const [editForm, setEditForm] = useState<EditProfileForm>(initialForm)
  const [successMessage, setSuccessMessage] = useState<string>('')
  const [errors, setErrors] = useState<{ phone?: string }>({})

  // Validate phone number
  const validatePhone = (phone: string): string | undefined => {
    if (!phone) return undefined
    // Remove spaces, dashes, and parentheses
    const cleaned = phone.replace(/[\s\-\(\)]/g, '')
    // Check if it contains only digits and optional + at start
    if (!/^\+?[0-9]{10,15}$/.test(cleaned)) {
      return 'Please enter a valid phone number (10-15 digits)'
    }
    return undefined
  }

  const updateProfileMutation = useMutation({
    mutationFn: async (data: Partial<EditProfileForm>) => {
      // Send all profile fields to backend
      const updateData: any = {}
      if (data.firstName !== undefined) updateData.firstName = data.firstName
      if (data.lastName !== undefined) updateData.lastName = data.lastName
      if (data.email !== undefined) updateData.email = data.email
      if (data.phone !== undefined) updateData.phone = data.phone
      if (data.companyName !== undefined) updateData.companyName = data.companyName
      if (data.location !== undefined) updateData.location = data.location
      
      const response = await apiClient.put('/api/auth/profile', updateData)
      return response.data
    },
    onSuccess: (data) => {
      console.log('[Profile] Update successful:', data)
      const userData = data?.data
      
      // Update cookies with new user info
      if (userData) {
        if (userData.email) {
          Cookies.set('userEmail', userData.email, { path: '/', expires: 7 })
        }
        
        if (userData.firstName || userData.lastName) {
          const fullName = [userData.firstName, userData.lastName].filter(Boolean).join(' ') || userData.email?.split('@')[0] || 'User'
          Cookies.set('userName', fullName, { path: '/', expires: 7 })
        }
      }
      
      setSuccessMessage('Profile updated successfully!')
      setTimeout(() => setSuccessMessage(''), 3000)
      
      // Call onSuccess callback to refresh profile page
      onSuccess?.()
    },
    onError: (error: any) => {
      console.error('[Profile] Update error:', error)
      const errorMessage = error.response?.data?.error?.message || 'Failed to update profile'
      alert(errorMessage)
    }
  })

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault()
    
    // VALIDATION COMMENTED OUT - Uncomment if needed
    // Validate fields
    // const phoneError = validatePhone(editForm.phone)
    // 
    // const newErrors: { phone?: string } = {}
    // if (phoneError) newErrors.phone = phoneError
    // 
    // setErrors(newErrors)
    // 
    // // If there are errors, don't submit
    // if (Object.keys(newErrors).length > 0) {
    //   return
    // }
    
    updateProfileMutation.mutate(editForm)
  }

  const handlePhoneChange = (value: string) => {
    setEditForm({ ...editForm, phone: value })
    // VALIDATION COMMENTED OUT - Uncomment if needed
    // Clear error when user starts typing
    // if (errors.phone) {
    //   const error = validatePhone(value)
    //   setErrors({ ...errors, phone: error })
    // }
  }

  return (
    <Card className="bg-gradient-to-br from-[#1a1a1a] via-[#1f1f1f] to-[#1a1a1a] border border-orange-500/20 shadow-xl shadow-orange-500/5 hover:shadow-orange-500/10 transition-all duration-300 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500/50 via-orange-500 to-orange-500/50"></div>
      <CardHeader className="pb-6">
        <CardTitle className="text-2xl font-bold text-white flex items-center gap-3 mb-2" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '700' }}>
          <div className="w-1.5 h-7 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full shadow-sm shadow-orange-500/50"></div>
          Edit Profile
        </CardTitle>
        <CardDescription className="text-gray-400 text-base">Update your personal information and preferences</CardDescription>
      </CardHeader>
      <CardContent>
        {successMessage && (
          <div className="mb-6 p-4 bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/50 rounded-xl text-green-400 text-sm font-medium shadow-lg shadow-green-500/10 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {successMessage}
          </div>
        )}
        <form onSubmit={handleUpdateProfile} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="edit-firstName" className="text-sm text-gray-300 font-medium">First Name</Label>
              <Input
                id="edit-firstName"
                value={editForm.firstName}
                onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                className="bg-[#2a2a2a]/80 text-white border-orange-500/30 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50 transition-all h-11 hover:border-orange-500/50"
                placeholder="First name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-lastName" className="text-sm text-gray-300 font-medium">Last Name</Label>
              <Input
                id="edit-lastName"
                value={editForm.lastName}
                onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                className="bg-[#2a2a2a]/80 text-white border-orange-500/30 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50 transition-all h-11 hover:border-orange-500/50"
                placeholder="Last name"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-email" className="text-sm text-gray-300 font-medium">Email</Label>
            <Input
              id="edit-email"
              type="email"
              value={editForm.email}
              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              className="bg-[#2a2a2a]/80 text-white border-orange-500/30 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50 transition-all h-11 hover:border-orange-500/50"
              placeholder="Email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-phone" className="text-sm text-gray-300 font-medium">Phone *</Label>
            <Input
              id="edit-phone"
              type="tel"
              value={editForm.phone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              className={`bg-[#2a2a2a]/80 text-white border-orange-500/30 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50 transition-all h-11 hover:border-orange-500/50 ${errors.phone ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' : ''}`}
              placeholder="Phone"
            />
            {/* VALIDATION COMMENTED OUT - Uncomment if needed */}
            {/* {errors.phone && (
              <p className="text-sm text-red-400 mt-1">{errors.phone}</p>
            )} */}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="edit-companyName" className="text-sm text-gray-300 font-medium">Company Name</Label>
              <Input
                id="edit-companyName"
                value={editForm.companyName}
                onChange={(e) => setEditForm({ ...editForm, companyName: e.target.value })}
                className="bg-[#2a2a2a]/80 text-white border-orange-500/30 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50 transition-all h-11 hover:border-orange-500/50"
                placeholder="Company Name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-location" className="text-sm text-gray-300 font-medium">Location</Label>
              <Input
                id="edit-location"
                value={editForm.location}
                onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                className="bg-[#2a2a2a]/80 text-white border-orange-500/30 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50 transition-all h-11 hover:border-orange-500/50"
                placeholder="Location"
              />
            </div>
          </div>
          <div className="pt-4">
            <Button
              type="submit"
              disabled={updateProfileMutation.isPending}
              className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white py-3.5 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-orange-500/50 disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}
            >
              {updateProfileMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

