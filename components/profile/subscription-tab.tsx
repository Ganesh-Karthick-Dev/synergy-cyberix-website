"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function SubscriptionTab() {
  return (
    <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#1f1f1f] border border-orange-500/20 shadow-lg">
      <CardHeader className="pb-6">
        <CardTitle className="text-2xl font-bold text-white flex items-center gap-3 mb-2" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '700' }}>
          <div className="w-1 h-6 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full"></div>
          Subscription
        </CardTitle>
        <CardDescription className="text-gray-400 text-base">Manage your subscription plan</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="p-6 bg-gradient-to-r from-orange-500/10 to-orange-600/10 border border-orange-500/30 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Current Plan</h3>
                <p className="text-sm text-gray-400">FREE</p>
              </div>
              <div className="px-4 py-2 bg-orange-500/20 border border-orange-500/50 rounded-lg">
                <span className="text-orange-400 font-medium">Active</span>
              </div>
            </div>
            <p className="text-sm text-gray-300 mb-4">
              You are currently on the free plan. Upgrade to access premium features.
            </p>
            <Button className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white">
              Upgrade Plan
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-[#2a2a2a] border border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg">Free</CardTitle>
                <CardDescription className="text-2xl font-bold text-white mt-2">
                  $0<span className="text-sm text-gray-400">/month</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>✓ Basic features</li>
                  <li>✓ Limited scans</li>
                  <li>✓ Community support</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 border-2 border-orange-500">
              <CardHeader>
                <CardTitle className="text-lg">Pro</CardTitle>
                <CardDescription className="text-2xl font-bold text-white mt-2">
                  $29<span className="text-sm text-gray-400">/month</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>✓ All basic features</li>
                  <li>✓ Unlimited scans</li>
                  <li>✓ Priority support</li>
                  <li>✓ Advanced reports</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="bg-[#2a2a2a] border border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg">Enterprise</CardTitle>
                <CardDescription className="text-2xl font-bold text-white mt-2">
                  Custom
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>✓ All Pro features</li>
                  <li>✓ Custom integrations</li>
                  <li>✓ Dedicated support</li>
                  <li>✓ SLA guarantee</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

