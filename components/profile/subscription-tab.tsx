"use client"

import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Crown, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface Subscription {
  id: string
  planId: string
  plan: {
    id: string
    name: string
    price: number
    description: string
    features: any
    billingCycle?: string
  }
  status: string
  startDate: string
  endDate: string | null
  autoRenew: boolean
}

async function fetchActiveSubscription() {
  // Note: We don't need to check for token client-side
  // The API route will handle authentication server-side using cookies
  // Cookies are automatically sent with credentials: 'include'
  
  const response = await fetch('/api/subscription/active', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // This sends cookies automatically
    cache: 'no-store'
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error?.message || 'Failed to fetch subscription')
  }

  const data = await response.json()
  return data.data || null
}

function formatDate(dateString: string | null) {
  if (!dateString) return 'Lifetime'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function formatPlanName(name: string) {
  const planMap: Record<string, string> = {
    'FREE': 'Free',
    'PRO': 'Pro',
    'PRO_PLUS': 'Pro Plus'
  }
  return planMap[name] || name
}

function formatBillingCycle(cycle: string | undefined) {
  if (!cycle) return null
  const cycleMap: Record<string, string> = {
    'MONTHLY': 'Monthly',
    'YEARLY': 'Yearly',
    'LIFETIME': 'Lifetime'
  }
  return cycleMap[cycle] || cycle
}

function getDaysRemaining(endDate: string | null) {
  if (!endDate) return null
  const end = new Date(endDate)
  const now = new Date()
  const diff = end.getTime() - now.getTime()
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
  return days > 0 ? days : 0
}

function getPlanBadgeColor(planName: string) {
  switch (planName) {
    case 'PRO_PLUS':
      return 'bg-purple-500/20 border-purple-500/50 text-purple-400'
    case 'PRO':
      return 'bg-blue-500/20 border-blue-500/50 text-blue-400'
    default:
      return 'bg-orange-500/20 border-orange-500/50 text-orange-400'
  }
}

export function SubscriptionTab() {
  const router = useRouter()
  const { data: subscription, isLoading, error, refetch } = useQuery({
    queryKey: ['activeSubscription'],
    queryFn: fetchActiveSubscription,
    retry: 1,
    refetchInterval: 60000, // Refetch every minute
  })

  const isActive = subscription && subscription.status === 'ACTIVE'
  const daysRemaining = subscription ? getDaysRemaining(subscription.endDate) : null
  const isExpiringSoon = daysRemaining !== null && daysRemaining <= 7 && daysRemaining > 0
  const isExpired = daysRemaining !== null && daysRemaining <= 0

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
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            <span className="ml-3 text-gray-400">Loading subscription...</span>
          </div>
        ) : error ? (
          <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-lg">
            <div className="flex items-center space-x-2 text-red-400">
              <AlertCircle className="w-5 h-5" />
              <p className="text-sm">Failed to load subscription: {error.message}</p>
            </div>
          </div>
        ) : subscription && isActive ? (
          <div className="space-y-6">
            {/* Current Active Subscription */}
            <div className={`p-6 bg-gradient-to-r ${subscription.plan.name === 'PRO_PLUS' ? 'from-purple-500/10 to-purple-600/10' : subscription.plan.name === 'PRO' ? 'from-blue-500/10 to-blue-600/10' : 'from-orange-500/10 to-orange-600/10'} border ${subscription.plan.name === 'PRO_PLUS' ? 'border-purple-500/30' : subscription.plan.name === 'PRO' ? 'border-blue-500/30' : 'border-orange-500/30'} rounded-lg`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {subscription.plan.name !== 'FREE' && (
                    <Crown className={`w-6 h-6 ${subscription.plan.name === 'PRO_PLUS' ? 'text-purple-400' : subscription.plan.name === 'PRO' ? 'text-blue-400' : 'text-orange-400'}`} />
                  )}
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">Current Plan</h3>
                    <p className="text-sm text-gray-400">{formatPlanName(subscription.plan.name)}</p>
                  </div>
                </div>
                <div className={`px-4 py-2 rounded-lg border ${getPlanBadgeColor(subscription.plan.name)}`}>
                  <span className="font-medium">
                    {isExpired ? 'Expired' : isExpiringSoon ? 'Expiring Soon' : 'Active'}
                  </span>
                </div>
              </div>

              {/* Validity Information */}
              <div className="space-y-3 mb-4">
                {subscription.plan.billingCycle && (
                  <div className="flex items-center space-x-2 text-gray-300">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">
                      <strong>Billing Cycle:</strong> {formatBillingCycle(subscription.plan.billingCycle)}
                    </span>
                  </div>
                )}
                <div className="flex items-center space-x-2 text-gray-300">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">
                    <strong>Started:</strong> {formatDate(subscription.startDate)}
                  </span>
                </div>
                {subscription.endDate ? (
                  <div className="flex items-center space-x-2 text-gray-300">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">
                      <strong>Valid Until:</strong> {formatDate(subscription.endDate)}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-gray-300">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm font-medium text-green-400">Lifetime Plan</span>
                  </div>
                )}
                {daysRemaining !== null && daysRemaining > 0 && (
                  <div className={`flex items-center space-x-2 ${isExpiringSoon ? 'text-yellow-400' : 'text-gray-300'}`}>
                    <AlertCircle className={`w-4 h-4 ${isExpiringSoon ? 'text-yellow-400' : 'text-gray-400'}`} />
                    <span className={`text-sm ${isExpiringSoon ? 'font-medium' : ''}`}>
                      {daysRemaining} day{daysRemaining !== 1 ? 's' : ''} remaining
                    </span>
                  </div>
                )}
                {isExpired && (
                  <div className="flex items-center space-x-2 text-red-400">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Subscription has expired</span>
                  </div>
                )}
              </div>

              {/* Plan Features */}
              {subscription.plan.features && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <p className="text-xs text-gray-400 mb-2">Plan Features:</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(subscription.plan.features).map(([key, value]) => {
                      if (typeof value === 'boolean' && value) {
                        return (
                          <span key={key} className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-300">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                        )
                      }
                      return null
                    })}
                  </div>
                </div>
              )}

              {/* Actions */}
              {!isExpired && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <p className="text-xs text-gray-400 mb-3">
                    Your subscription is active. You cannot purchase a new plan until it expires.
                  </p>
                </div>
              )}
              {isExpired && (
                <Button 
                  onClick={() => router.push('/pricing')}
                  className="mt-4 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white"
                >
                  Renew Subscription
                </Button>
              )}
            </div>
          </div>
        ) : (
          // No active subscription - show FREE plan
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
              <Button 
                onClick={() => router.push('/pricing')}
                className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white"
              >
                Upgrade Plan
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
