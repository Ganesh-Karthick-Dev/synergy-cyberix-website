"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Crown, CheckCircle, AlertCircle, Loader2, Clock, CreditCard, Sparkles, Play, Package } from "lucide-react"
import { useRouter } from "next/navigation"
import { type ServicePlan } from "@/lib/api/website"
import { useActiveSubscription } from "@/hooks/use-subscription"
import { useWebsiteData } from "@/hooks/use-website-data"
import { usePurchasedPlans, useActivatePurchasedPlan } from "@/hooks/use-purchased-plans"
import { formatDistanceToNow } from "date-fns"

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

// Plan hierarchy for comparison
const PLAN_HIERARCHY: Record<string, number> = {
  'FREE': 0,
  'PRO': 1,
  'PRO_PLUS': 2
}

export function SubscriptionTab() {
  const router = useRouter()
  // Use shared hook for active subscription
  const { data: subscription, isLoading, error } = useActiveSubscription()

  // Fetch purchased plans (queue)
  const { data: purchasedPlans = [], isLoading: isLoadingPurchased, error: purchasedPlansError } = usePurchasedPlans()
  const activatePlan = useActivatePurchasedPlan()

  // Debug logging
  useEffect(() => {
    console.log('[Subscription Tab] Purchased Plans:', {
      count: purchasedPlans.length,
      plans: purchasedPlans,
      isLoading: isLoadingPurchased,
      error: purchasedPlansError,
    })
  }, [purchasedPlans, isLoadingPurchased, purchasedPlansError])

  // Fetch website data (includes plans) using shared hook
  const { data: websiteData, isLoading: plansLoading } = useWebsiteData()
  const allPlans = websiteData?.plans || []

  const handleActivatePlan = async (purchasedPlanId: string) => {
    try {
      await activatePlan.mutateAsync(purchasedPlanId)
    } catch (error) {
      console.error('Failed to activate plan:', error)
    }
  }

  const isActive = subscription && subscription.status === 'ACTIVE'
  const daysRemaining = subscription ? getDaysRemaining(subscription.endDate) : null
  const isExpiringSoon = daysRemaining !== null && daysRemaining <= 7 && daysRemaining > 0
  const isExpired = daysRemaining !== null && daysRemaining <= 0
  const currentPlanName = subscription?.plan?.name || 'FREE'
  const currentPlanLevel = PLAN_HIERARCHY[currentPlanName] || 0

  return (
    <Card className="bg-gradient-to-br from-[#1a1a1a] via-[#1f1f1f] to-[#1a1a1a] border border-orange-500/20 shadow-xl shadow-orange-500/5 hover:shadow-orange-500/10 transition-all duration-300 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500/50 via-orange-500 to-orange-500/50"></div>
      <CardHeader className="pb-6 relative z-10">
        <CardTitle className="text-2xl font-bold text-white flex items-center gap-3 mb-2" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '700' }}>
          <div className="w-1.5 h-7 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full shadow-sm shadow-orange-500/50"></div>
          Subscription
        </CardTitle>
        <CardDescription className="text-gray-400 text-base">Manage your subscription plan and billing</CardDescription>
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
        ) : (
          <div className="space-y-6">
            {/* Debug Info - Remove after fixing */}
            {/* {process.env.NODE_ENV === 'development' && (
              <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg text-xs text-blue-400">
                <p>Debug: purchasedPlans.length = {purchasedPlans.length}</p>
                <p>Debug: isLoadingPurchased = {isLoadingPurchased ? 'true' : 'false'}</p>
                <p>Debug: error = {purchasedPlansError ? JSON.stringify(purchasedPlansError) : 'none'}</p>
              </div>
            )} */}

            {/* Purchased Plans Queue - Always show this section */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-8 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full"></div>
                <h3 className="text-xl font-bold text-white" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '700' }}>
                  Purchased Plans Queue
                </h3>
                {purchasedPlans.length > 0 && (
                  <span className="px-3 py-1 bg-orange-500/20 border border-orange-500/50 rounded-full text-sm text-orange-400 font-semibold">
                    {purchasedPlans.length} {purchasedPlans.length === 1 ? 'Plan' : 'Plans'}
                  </span>
                )}
              </div>
                {currentPlanName === 'FREE' && (
                  <div className="mb-6 p-4 bg-gradient-to-r from-orange-500/10 to-orange-600/10 border border-orange-500/30 rounded-xl">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-orange-300 mb-1">Activate Your Purchased Plan</p>
                        <p className="text-sm text-gray-300">
                          You have {purchasedPlans.length} purchased plan{purchasedPlans.length > 1 ? 's' : ''} ready to activate. Click "Activate Now" on any plan below to switch from Free plan.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                <div className="space-y-4">
                  {purchasedPlans.map((purchasedPlan) => (
                    <Card
                      key={purchasedPlan.id}
                      className="bg-gradient-to-br from-[#2a2a2a] to-[#252525] border border-orange-500/30 hover:border-orange-500/50 transition-all duration-300 overflow-hidden relative group"
                    >
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500/50 via-orange-500 to-orange-500/50"></div>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-500/30">
                                <Package className="w-5 h-5 text-orange-400" />
                              </div>
                              <div>
                                <h4 className="text-lg font-bold text-white" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}>
                                  {formatPlanName(purchasedPlan.plan.name.toUpperCase())}
                                </h4>
                                <p className="text-sm text-gray-400">{formatBillingCycle(purchasedPlan.plan.billingCycle)}</p>
                              </div>
                              <span className="px-3 py-1 bg-yellow-500/20 border border-yellow-500/50 rounded-lg text-xs text-yellow-400 font-medium">
                                Pending Activation
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                              <span>${purchasedPlan.plan.price}</span>
                              <span>•</span>
                              <span>Purchased {formatDistanceToNow(new Date(purchasedPlan.createdAt), { addSuffix: true })}</span>
                            </div>
                            {purchasedPlan.plan.description && (
                              <p className="text-sm text-gray-400 mb-4">{purchasedPlan.plan.description}</p>
                            )}
                          </div>
                          <Button
                            onClick={() => handleActivatePlan(purchasedPlan.id)}
                            disabled={activatePlan.isPending}
                            className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white flex-shrink-0"
                          >
                            {activatePlan.isPending ? (
                              <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            ) : (
                              <Play className="w-4 h-4 mr-2" />
                            )}
                            Activate Now
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* All Plans Section */}
            {!plansLoading && allPlans && allPlans.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-8 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full"></div>
                  <h3 className="text-xl font-bold text-white" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '700' }}>All Plans</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {allPlans.map((plan: ServicePlan) => {
                    const planName = plan.name.toUpperCase()
                    const planLevel = PLAN_HIERARCHY[planName] || 0
                    const isCurrentPlan = planName === currentPlanName
                    const isHigherPlan = planLevel > currentPlanLevel
                    const isLowerPlan = planLevel < currentPlanLevel

                    return (
                      <Card 
                        key={plan.id} 
                        className={`bg-gradient-to-br from-[#2a2a2a] to-[#252525] border transition-all duration-300 overflow-hidden relative group ${
                          isCurrentPlan 
                            ? 'border-orange-500/60 ring-2 ring-orange-500/40 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30' 
                            : 'border-gray-700/50 hover:border-orange-500/30 hover:shadow-lg'
                        }`}
                      >
                        {isCurrentPlan && (
                          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500"></div>
                        )}
                        <CardHeader className={isCurrentPlan ? 'pt-6' : ''}>
                          <div className="flex items-center justify-between mb-3">
                            <CardTitle className="text-lg font-bold text-white flex items-center gap-2" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}>
                              {isCurrentPlan && (
                                <div className="p-1.5 rounded-lg bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-500/30">
                                  <Crown className="w-4 h-4 text-orange-400" />
                                </div>
                              )}
                              {formatPlanName(planName)}
                            </CardTitle>
                            {isCurrentPlan && (
                              <span className="px-3 py-1 bg-orange-500/20 border border-orange-500/50 rounded-lg text-xs text-orange-400 font-medium backdrop-blur-sm">
                                Active
                              </span>
                            )}
                          </div>
                          <div className="text-3xl font-bold text-white mb-1" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '700' }}>
                            ${plan.price}
                            <span className="text-base text-gray-400 font-normal ml-1">/month</span>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-400 mb-5 leading-relaxed">{plan.description}</p>
                          {isCurrentPlan ? (
                            <Button 
                              disabled={planName !== 'FREE'}
                              onClick={planName === 'FREE' ? () => router.push('/pricing') : undefined}
                              className={`w-full ${
                                planName === 'FREE' 
                                  ? 'bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white cursor-pointer' 
                                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                              }`}
                            >
                              {planName === 'FREE' ? 'Free Trial' : 'Current Plan'}
                            </Button>
                          ) : planName === 'FREE' ? (
                            <Button 
                              onClick={() => router.push('/pricing')}
                              className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white cursor-pointer"
                            >
                              Free Trial
                            </Button>
                          ) : isHigherPlan ? (
                            <Button 
                              onClick={() => router.push(`/pricing?planId=${plan.id}`)}
                              className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white cursor-pointer"
                            >
                              Upgrade to {formatPlanName(planName)}
                            </Button>
                          ) : (
                            <Button 
                              onClick={() => router.push('/profile?tab=billing')}
                              variant="outline"
                              className="w-full border-orange-500/50 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 hover:text-orange-300 cursor-pointer"
                              style={{ color: '#fb923c' }}
                            >
                              View Purchase History
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Current Active Subscription or FREE Plan - Show Below */}
            <div className="mt-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-8 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full"></div>
                <h3 className="text-xl font-bold text-white" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '700' }}>Current Plan Details</h3>
              </div>
              {subscription && isActive ? (
              <div className="p-6 bg-gradient-to-br from-[#2a2a2a] to-[#252525] border border-gray-700/50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden relative group">
                {/* Subtle glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 via-orange-500/0 to-orange-500/0 group-hover:from-orange-500/5 group-hover:via-orange-500/0 group-hover:to-orange-500/5 transition-all duration-500 pointer-events-none"></div>
                
                <div className="relative z-10">
                  {/* Header Section */}
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-700/50">
                    <div className="flex items-center space-x-4">
                      {subscription.plan.name !== 'FREE' && (
                        <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-500/30 shadow-lg shadow-orange-500/10">
                          <Crown className="w-6 h-6 text-orange-400" />
                        </div>
                      )}
                      <div>
                        <h3 className="text-lg font-bold text-white mb-1" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}>Current Plan</h3>
                        <p className="text-sm text-gray-400">{formatPlanName(subscription.plan.name)}</p>
                      </div>
                    </div>
                    <div className="px-4 py-2 rounded-lg border bg-orange-500/20 border-orange-500/50 backdrop-blur-sm">
                      <span className="font-medium text-orange-400 text-sm">
                        {isExpired ? 'Expired' : isExpiringSoon ? 'Expiring Soon' : 'Active'}
                      </span>
                    </div>
                  </div>

                  {/* Information Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {subscription.plan.billingCycle && (
                      <div className="flex items-center gap-3 p-4 rounded-xl bg-[#1a1a1a]/60 border border-gray-700/30 hover:border-gray-600/50 transition-all duration-300 group/item">
                        <div className="p-2.5 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-600/10 group-hover/item:from-blue-500/20 group-hover/item:to-blue-600/20 transition-all duration-300">
                          <CreditCard className="w-5 h-5 text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">Billing Cycle</p>
                          <p className="text-sm font-semibold text-white">{formatBillingCycle(subscription.plan.billingCycle)}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-[#1a1a1a]/60 border border-gray-700/30 hover:border-gray-600/50 transition-all duration-300 group/item">
                      <div className="p-2.5 rounded-lg bg-gradient-to-br from-green-500/10 to-green-600/10 group-hover/item:from-green-500/20 group-hover/item:to-green-600/20 transition-all duration-300">
                        <Calendar className="w-5 h-5 text-green-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">Started</p>
                        <p className="text-sm font-semibold text-white">{formatDate(subscription.startDate)}</p>
                      </div>
                    </div>
                    {subscription.endDate ? (
                      <div className="flex items-center gap-3 p-4 rounded-xl bg-[#1a1a1a]/60 border border-gray-700/30 hover:border-gray-600/50 transition-all duration-300 group/item">
                        <div className="p-2.5 rounded-lg bg-gradient-to-br from-purple-500/10 to-purple-600/10 group-hover/item:from-purple-500/20 group-hover/item:to-purple-600/20 transition-all duration-300">
                          <Clock className="w-5 h-5 text-purple-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">Valid Until</p>
                          <p className="text-sm font-semibold text-white">{formatDate(subscription.endDate)}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 p-4 rounded-xl bg-[#1a1a1a]/60 border border-green-700/30 hover:border-green-600/50 transition-all duration-300 group/item">
                        <div className="p-2.5 rounded-lg bg-gradient-to-br from-green-500/20 to-green-600/20 group-hover/item:from-green-500/30 group-hover/item:to-green-600/30 transition-all duration-300">
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">Plan Type</p>
                          <p className="text-sm font-semibold text-green-400">Lifetime Plan</p>
                        </div>
                      </div>
                    )}
                    {daysRemaining !== null && daysRemaining > 0 && (
                      <div className={`flex items-center gap-3 p-4 rounded-xl bg-[#1a1a1a]/60 border transition-all duration-300 group/item ${
                        isExpiringSoon 
                          ? 'border-yellow-700/30 hover:border-yellow-600/50' 
                          : 'border-gray-700/30 hover:border-gray-600/50'
                      }`}>
                        <div className={`p-2.5 rounded-lg transition-all duration-300 ${
                          isExpiringSoon
                            ? 'bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 group-hover/item:from-yellow-500/30 group-hover/item:to-yellow-600/30'
                            : 'bg-gradient-to-br from-gray-500/10 to-gray-600/10 group-hover/item:from-gray-500/20 group-hover/item:to-gray-600/20'
                        }`}>
                          <AlertCircle className={`w-5 h-5 ${isExpiringSoon ? 'text-yellow-400' : 'text-gray-400'}`} />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">Days Remaining</p>
                          <p className={`text-sm font-semibold ${isExpiringSoon ? 'text-yellow-400' : 'text-white'}`}>
                            {daysRemaining} day{daysRemaining !== 1 ? 's' : ''} remaining
                          </p>
                        </div>
                      </div>
                    )}
                    {isExpired && (
                      <div className="flex items-center gap-3 p-4 rounded-xl bg-[#1a1a1a]/60 border border-red-700/30 hover:border-red-600/50 transition-all duration-300 group/item">
                        <div className="p-2.5 rounded-lg bg-gradient-to-br from-red-500/20 to-red-600/20 group-hover/item:from-red-500/30 group-hover/item:to-red-600/30 transition-all duration-300">
                          <AlertCircle className="w-5 h-5 text-red-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">Status</p>
                          <p className="text-sm font-semibold text-red-400">Subscription Expired</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Plan Features */}
                  {subscription.plan.features && (
                    <div className="mt-6 pt-6 border-t border-gray-700/50">
                      <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="w-4 h-4 text-orange-400" />
                        <p className="text-sm font-semibold text-white uppercase tracking-wide">Plan Features</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(subscription.plan.features).map(([key, value]) => {
                          if (typeof value === 'boolean' && value) {
                            return (
                              <span key={key} className="px-3 py-1.5 bg-[#1a1a1a] border border-gray-700/50 rounded-lg text-xs text-gray-300 hover:border-orange-500/30 hover:text-orange-300 transition-all duration-300">
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
                  <div className="mt-6 pt-6 border-t border-gray-700/50">
                    <Button 
                      onClick={() => router.push('/pricing')}
                      className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-orange-500/50 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                      style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}
                    >
                      Purchase New Plan
                    </Button>
                  </div>
                </div>
              </div>
              ) : (
                // No active subscription - show FREE plan
                <div className="p-6 bg-gradient-to-br from-[#2a2a2a] to-[#252525] border border-gray-700/50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 via-orange-500/0 to-orange-500/0 group-hover:from-orange-500/5 group-hover:via-orange-500/0 group-hover:to-orange-500/5 transition-all duration-500 pointer-events-none"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-700/50">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-gray-500/20 to-gray-600/20 border border-gray-700/30">
                          <Sparkles className="w-6 h-6 text-gray-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white mb-1" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}>Current Plan</h3>
                          <p className="text-sm text-gray-400">FREE</p>
                        </div>
                      </div>
                      <div className="px-4 py-2 bg-orange-500/20 border border-orange-500/50 rounded-lg backdrop-blur-sm">
                        <span className="text-orange-400 font-medium text-sm">Active</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                      <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-300 leading-relaxed">
                        You are currently on the free plan. Upgrade to access premium features and unlock advanced security tools.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        )}
      </CardContent>
    </Card>
  )
}
