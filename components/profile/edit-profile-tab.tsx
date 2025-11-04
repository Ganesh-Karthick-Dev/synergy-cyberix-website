"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useMutation } from '@tanstack/react-query'
import apiClient from '@/lib/api/client'

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

interface EditProfileTabProps {
  initialForm: EditProfileForm
  onSuccess?: () => void
}

export function EditProfileTab({ initialForm, onSuccess }: EditProfileTabProps) {
  const [editForm, setEditForm] = useState<EditProfileForm>(initialForm)

  const updateProfileMutation = useMutation({
    mutationFn: async (data: EditProfileForm) => {
      const response = await apiClient.put('/api/users/me', data)
      return response.data
    },
    onSuccess: (data) => {
      console.log('[Profile] Update successful:', data)
      onSuccess?.()
    },
    onError: (error: any) => {
      console.error('[Profile] Update error:', error)
      alert(error.response?.data?.error?.message || 'Failed to update profile')
    }
  })

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault()
    updateProfileMutation.mutate(editForm)
  }

  return (
    <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#1f1f1f] border border-orange-500/20 shadow-lg">
      <CardHeader className="pb-6">
        <CardTitle className="text-2xl font-bold text-white flex items-center gap-3 mb-2" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '700' }}>
          <div className="w-1 h-6 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full"></div>
          Edit Profile
        </CardTitle>
        <CardDescription className="text-gray-400 text-base">Update your personal information</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleUpdateProfile} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-firstName" className="text-sm text-gray-300">First Name</Label>
                      <Input
                        id="edit-firstName"
                        value={editForm.firstName}
                        onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                        className="bg-[#2a2a2a] text-white border-orange-500/30 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50 transition-all"
                        placeholder="First name"
                      />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-lastName" className="text-sm text-gray-300">Last Name</Label>
              <Input
                id="edit-lastName"
                value={editForm.lastName}
                onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                className="bg-[#2a2a2a] text-white border-orange-500/30 focus:border-orange-500"
                placeholder="Last name"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-email" className="text-sm text-gray-300">Email</Label>
            <Input
              id="edit-email"
              type="email"
              value={editForm.email}
              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              className="bg-[#2a2a2a] text-white border-orange-500/30 focus:border-orange-500"
              placeholder="Email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-phone" className="text-sm text-gray-300">Phone</Label>
            <Input
              id="edit-phone"
              type="tel"
              value={editForm.phone}
              onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
              className="bg-[#2a2a2a] text-white border-orange-500/30 focus:border-orange-500"
              placeholder="Phone"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-address" className="text-sm text-gray-300">Address</Label>
            <Input
              id="edit-address"
              value={editForm.address}
              onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
              className="bg-[#2a2a2a] text-white border-orange-500/30 focus:border-orange-500"
              placeholder="Address"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-city" className="text-sm text-gray-300">City</Label>
              <Input
                id="edit-city"
                value={editForm.city}
                onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                className="bg-[#2a2a2a] text-white border-orange-500/30 focus:border-orange-500"
                placeholder="City"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-postcode" className="text-sm text-gray-300">Postcode</Label>
              <Input
                id="edit-postcode"
                value={editForm.postcode}
                onChange={(e) => setEditForm({ ...editForm, postcode: e.target.value })}
                className="bg-[#2a2a2a] text-white border-orange-500/30 focus:border-orange-500"
                placeholder="Postcode"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-dateOfBirth" className="text-sm text-gray-300">Date of Birth</Label>
              <Input
                id="edit-dateOfBirth"
                type="date"
                value={editForm.dateOfBirth}
                onChange={(e) => setEditForm({ ...editForm, dateOfBirth: e.target.value })}
                className="bg-[#2a2a2a] text-white border-orange-500/30 focus:border-orange-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-nationalId" className="text-sm text-gray-300">National ID</Label>
              <Input
                id="edit-nationalId"
                value={editForm.nationalId}
                onChange={(e) => setEditForm({ ...editForm, nationalId: e.target.value })}
                className="bg-[#2a2a2a] text-white border-orange-500/30 focus:border-orange-500"
                placeholder="National ID"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-title" className="text-sm text-gray-300">Title</Label>
            <Input
              id="edit-title"
              value={editForm.title}
              onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              className="bg-[#2a2a2a] text-white border-orange-500/30 focus:border-orange-500"
              placeholder="Job Title"
            />
          </div>
          <Button
            type="submit"
            disabled={updateProfileMutation.isPending}
            className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-orange-500/50 disabled:opacity-50"
            style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}
          >
            {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

