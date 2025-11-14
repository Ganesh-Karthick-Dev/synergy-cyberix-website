"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface NotificationPreference {
  id: string
  label: string
  description: string
  enabled: boolean
}

const defaultPreferences: NotificationPreference[] = [
  {
    id: "email",
    label: "Email Notifications",
    description: "Receive email updates about your account",
    enabled: true
  },
  {
    id: "security",
    label: "Security Alerts",
    description: "Get notified about security events",
    enabled: true
  },
  {
    id: "product",
    label: "Product Updates",
    description: "Stay informed about new features",
    enabled: false
  },
  {
    id: "marketing",
    label: "Marketing Emails",
    description: "Receive promotional offers and updates",
    enabled: false
  }
]

export function NotificationsTab() {
  const [preferences, setPreferences] = useState<NotificationPreference[]>(defaultPreferences)

  const handleToggle = (id: string) => {
    setPreferences(prev => 
      prev.map(pref => 
        pref.id === id ? { ...pref, enabled: !pref.enabled } : pref
      )
    )
  }

  const handleSave = () => {
    // TODO: Implement API call to save preferences
    console.log('Saving preferences:', preferences)
    alert('Preferences saved!')
  }

  return (
    <Card className="bg-gradient-to-br from-[#1a1a1a] via-[#1f1f1f] to-[#1a1a1a] border border-orange-500/20 shadow-xl shadow-orange-500/5 hover:shadow-orange-500/10 transition-all duration-300 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500/50 via-orange-500 to-orange-500/50"></div>
      <CardHeader className="pb-6">
        <CardTitle className="text-2xl font-bold text-white flex items-center gap-3 mb-2" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '700' }}>
          <div className="w-1.5 h-7 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full shadow-sm shadow-orange-500/50"></div>
          Notifications
        </CardTitle>
        <CardDescription className="text-gray-400 text-base">Manage your notification preferences and stay updated</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {preferences.map((preference) => (
            <div 
              key={preference.id}
              className="flex items-center justify-between p-5 bg-[#2a2a2a]/60 hover:bg-[#2a2a2a] rounded-xl border border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 group cursor-pointer"
            >
              <div className="flex-1">
                <h4 className="font-semibold text-white mb-1.5 group-hover:text-orange-100 transition-colors" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}>
                  {preference.label}
                </h4>
                <p className="text-sm text-gray-400">{preference.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={preference.enabled}
                  onChange={() => handleToggle(preference.id)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-orange-500 peer-checked:to-orange-600"></div>
              </label>
            </div>
          ))}
          <div className="pt-4">
            <Button 
              onClick={handleSave}
              className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white py-3.5 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-orange-500/50 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}
            >
              Save Preferences
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

