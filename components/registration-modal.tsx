"use client"
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { X } from "lucide-react"

interface RegistrationModalProps {
  isOpen: boolean
  onClose: () => void
}

export function RegistrationModal({ isOpen, onClose }: RegistrationModalProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    phone: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Close modal and redirect to download page
    onClose()
    window.location.href = '/download'
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>

        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '700' }}>
            Get Started with Cyberix
          </CardTitle>
          <CardDescription className="text-gray-300" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
            Fill out the form below to access your free security scanner
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-white" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '500' }}>First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="bg-white/10 border-white/30 text-white placeholder:text-gray-400 focus:border-orange-500"
                  placeholder="John"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-white" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '500' }}>Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="bg-white/10 border-white/30 text-white placeholder:text-gray-400 focus:border-orange-500"
                  placeholder="Doe"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '500' }}>Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="bg-white/10 border-white/30 text-white placeholder:text-gray-400 focus:border-orange-500"
                placeholder="john@company.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company" className="text-white" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '500' }}>Company</Label>
              <Input
                id="company"
                name="company"
                type="text"
                required
                value={formData.company}
                onChange={handleInputChange}
                className="bg-white/10 border-white/30 text-white placeholder:text-gray-400 focus:border-orange-500"
                placeholder="Your Company"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-white" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '500' }}>Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                className="bg-white/10 border-white/30 text-white placeholder:text-gray-400 focus:border-orange-500"
                placeholder="+1 (555) 123-4567"
              />
            </div>
            
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Processing...
                </div>
              ) : (
                'Get Free Scanner'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
