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
    <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#1f1f1f] border border-orange-500/20 shadow-lg">
      <CardHeader className="pb-6">
        <CardTitle className="text-2xl font-bold text-white flex items-center gap-3 mb-2" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '700' }}>
          <div className="w-1 h-6 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full"></div>
          Notifications
        </CardTitle>
        <CardDescription className="text-gray-400 text-base">Manage your notification preferences</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {preferences.map((preference) => (
            <div 
              key={preference.id}
              className="flex items-center justify-between p-4 bg-[#2a2a2a] rounded-lg border border-orange-500/20"
            >
              <div>
                <h4 className="font-medium text-white mb-1">{preference.label}</h4>
                <p className="text-sm text-gray-400">{preference.description}</p>
              </div>
              <input 
                type="checkbox" 
                checked={preference.enabled}
                onChange={() => handleToggle(preference.id)}
                className="w-5 h-5 rounded border-orange-500 text-orange-500 focus:ring-orange-500 cursor-pointer"
              />
            </div>
          ))}
          <Button 
            onClick={handleSave}
            className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white"
          >
            Save Preferences
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

