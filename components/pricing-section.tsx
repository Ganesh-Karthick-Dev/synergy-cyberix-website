"use client"

import React, { useState, useEffect, useRef, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"
import { Check, Lock, AlertCircle, Calendar, Crown, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import ElectricBorder from './ElectricBorder'
import { useAuth } from "@/components/auth-context"
import { getActivePlans, type ServicePlan } from "@/lib/api/website"

async function fetchActiveSubscription() {
  // Note: We don't need to check for token client-side
  // The API route will handle authentication server-side using cookies
  // Cookies are automatically sent with credentials: 'include'
  
  try {
    const response = await fetch('/api/subscription/active', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // This sends cookies automatically
      cache: 'no-store'
    })

    console.log('[Pricing] Subscription API response status:', response.status)

    if (!response.ok) {
      console.log('[Pricing] Subscription API error:', response.status)
      return null
    }

    const data = await response.json()
    console.log('[Pricing] Subscription API response data:', data)
    const subscription = data.data || null
    console.log('[Pricing] Parsed subscription:', subscription)
    return subscription
  } catch (error) {
    console.error('[Pricing] Error fetching subscription:', error)
    return null
  }
}

export function PricingSection() {
  const router = useRouter()
  const sectionRef = useRef<HTMLElement>(null)
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const { openRegisterModal } = useAuth()

  // Fetch active subscription - Always try to fetch (API will return null if not authenticated)
  const { data: activeSubscription, isLoading: isLoadingSubscription } = useQuery({
    queryKey: ['activeSubscription', 'pricing'],
    queryFn: fetchActiveSubscription,
    enabled: true, // Always enabled - API will handle auth
    refetchInterval: 60000, // Refetch every minute
    retry: false, // Don't retry on error
    staleTime: 0, // Always consider stale to ensure fresh data
  })

  // Check if subscription is active and valid - Use useMemo to ensure proper calculation
  const subscriptionState = useMemo(() => {
    if (!activeSubscription) {
      return {
        hasActiveSubscription: false,
        subscriptionEndDate: null,
        subscriptionStartDate: null,
        isLifetime: false,
        isExpired: false,
        canPurchase: true
      }
    }

    const endDate = activeSubscription.endDate ? new Date(activeSubscription.endDate) : null
    const startDate = activeSubscription.startDate ? new Date(activeSubscription.startDate) : null
    const isLifetime = activeSubscription.endDate === null
    const now = new Date()
    const isExpired = endDate ? endDate <= now : false
    
    // Subscription is active if: status is ACTIVE AND (lifetime OR not expired)
    const hasActive = activeSubscription.status === 'ACTIVE' && (isLifetime || !isExpired)
    
    return {
      hasActiveSubscription: hasActive,
      subscriptionEndDate: endDate,
      subscriptionStartDate: startDate,
      isLifetime,
      isExpired,
      canPurchase: !hasActive || isExpired
    }
  }, [activeSubscription])

  const { 
    hasActiveSubscription, 
    subscriptionEndDate, 
    subscriptionStartDate, 
    isLifetime, 
    isExpired, 
    canPurchase 
  } = subscriptionState
  
  // Debug logging - Always log to help debug
  useEffect(() => {
    const now = new Date()
    console.log('[Pricing] Subscription Check:', {
      hasSubscriptionData: !!activeSubscription,
      subscriptionData: activeSubscription,
      status: activeSubscription?.status,
      endDate: activeSubscription?.endDate,
      parsedEndDate: subscriptionEndDate?.toISOString(),
      isLifetime,
      isExpired,
      currentTime: now.toISOString(),
      hasActiveSubscription,
      canPurchase,
      willDisableButtons: hasActiveSubscription
    })
  }, [activeSubscription, subscriptionEndDate, isLifetime, isExpired, hasActiveSubscription, canPurchase])
  
  // Calculate days remaining
  const getDaysRemaining = () => {
    if (!subscriptionEndDate) return null
    const now = new Date()
    const diff = subscriptionEndDate.getTime() - now.getTime()
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
    return days > 0 ? days : 0
  }
  
  const daysRemaining = subscriptionEndDate ? getDaysRemaining() : null
  const isExpiringSoon = daysRemaining !== null && daysRemaining <= 7 && daysRemaining > 0
  
  // Format date for display
  const formatDate = (date: Date | null) => {
    if (!date) return 'Lifetime'
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
  
  // Format plan name
  const formatPlanName = (name: string) => {
    const planMap: Record<string, string> = {
      'FREE': 'Free',
      'PRO': 'Pro',
      'PRO_PLUS': 'Pro Plus'
    }
    return planMap[name] || name
  }

  // Check if user is logged in
  useEffect(() => {
    const checkAuthStatus = () => {
      const isAuth = Cookies.get('isAuthenticated') === 'true'
      const token = Cookies.get('accessToken')
      const loggedIn = isAuth || !!token
      setIsLoggedIn(loggedIn)
    }

    checkAuthStatus()
    const interval = setInterval(checkAuthStatus, 1000)
    return () => clearInterval(interval)
  }, [])

  const handlePlanClick = (planId: string, e: React.MouseEvent) => {
    e.preventDefault()
    
    // Check if user has active subscription (including lifetime)
    if (hasActiveSubscription) {
      if (isLifetime) {
        alert('You have a lifetime plan active. No additional purchase needed.')
      } else {
        alert(`You have an active subscription until ${subscriptionEndDate?.toLocaleDateString()}. Please wait until it expires to purchase a new plan.`)
      }
      return
    }
    
    if (isLoggedIn) {
      // If logged in, go directly to checkout
      router.push(`/checkout?planId=${planId}`)
    } else {
      // If not logged in, store planId and open registration modal
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('selectedPlanId', planId)
      }
      openRegisterModal()
    }
  }

  // Fetch active service plans
  const { data: plansData = [], isLoading } = useQuery({
    queryKey: ['activePlans'],
    queryFn: getActivePlans,
    refetchInterval: 300000, // Refetch every 5 minutes
    staleTime: 60000, // Consider data stale after 1 minute
  })

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-slide-up')
          }
        })
      },
      { threshold: 0.1 }
    )

    const elements = sectionRef.current?.querySelectorAll('.animate-on-scroll')
    elements?.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  // Transform API plans to component format
  // Maintain UI structure while using real data
  const plans = plansData.map((plan: ServicePlan, index: number) => {
    // Calculate yearly price (10% discount assumption, or use same price)
    const yearlyPrice = Math.round(plan.price * 12 * 0.9) // 10% discount for yearly
    
    // Determine button text based on price
    let buttonText = "Get Started"
    if (plan.price === 0) {
      buttonText = "Start Free Trial"
    } else if (plan.isPopular) {
      buttonText = "Upgrade to Pro"
    } else if (plan.price >= 150) {
      buttonText = "Contact Sales"
    }

    return {
      id: plan.id,
      name: plan.name,
      price: { 
        monthly: plan.price, 
        yearly: yearlyPrice 
      },
      description: plan.description || `${plan.name} plan for your security needs.`,
      features: plan.features || [],
      buttonText,
      popular: plan.isPopular || false,
      isActive: plan.isActive,
    }
  })

  // Set default hover to popular plan
  useEffect(() => {
    if (plans.length > 0 && hoveredCard === null) {
      const popularIndex = plans.findIndex((p) => p.popular)
      setHoveredCard(popularIndex >= 0 ? popularIndex : 0)
    }
  }, [plans, hoveredCard])

  // Show loading state
  if (isLoading) {
    return (
      <section 
        ref={sectionRef}
        className="min-h-screen py-20 px-4 flex items-center justify-center"
        style={{
          backgroundImage: "url('/hero/middle-1.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      >
        <div className="text-white text-xl">Loading plans...</div>
      </section>
    )
  }

  // Show empty state if no plans
  if (plans.length === 0) {
    return (
      <section 
        ref={sectionRef}
        className="min-h-screen py-20 px-4"
        style={{
          backgroundImage: "url('/hero/middle-1.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      >
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '700' }}>
            Choose the Plan
            <br />
            That's Right for You
          </h2>
          <p className="text-white/90 text-lg">No plans available at the moment.</p>
        </div>
      </section>
    )
  }

  return (
    <section 
      ref={sectionRef}
      className="min-h-screen py-20 px-4"
      style={{
        backgroundImage: "url('/hero/middle-1.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '700' }}>
            Choose the Plan
            <br />
            That's Right for You
          </h2>
          <p className="text-white/90 text-lg max-w-3xl mx-auto mb-8" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
            Giving you access to essential features and over 1,000 creative tools. Upgrade to the Pro Plan to unlock
            powerful AI capabilities, cloud syncing, and a whole new level of creative freedom.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-6 py-2 rounded-full transition-all duration-300 ${
                billingCycle === "monthly" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              <span style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '500' }}>Monthly</span>
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-6 py-2 rounded-full transition-all duration-300 ${
                billingCycle === "yearly" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              <span style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '500' }}>Yearly</span>
            </button>
          </div>
        </div>

        {/* Active Subscription Validity Banner */}
        {hasActiveSubscription && (isLifetime || !isExpired) && activeSubscription?.plan && (
          <div className={`max-w-4xl mx-auto mb-12 p-6 rounded-2xl border-2 backdrop-blur-sm ${
            activeSubscription.plan.name === 'PRO_PLUS' 
              ? 'bg-gradient-to-r from-purple-500/20 to-purple-600/20 border-purple-500/50'
              : activeSubscription.plan.name === 'PRO'
              ? 'bg-gradient-to-r from-blue-500/20 to-blue-600/20 border-blue-500/50'
              : 'bg-gradient-to-r from-orange-500/20 to-orange-600/20 border-orange-500/50'
          }`}>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  {activeSubscription.plan.name !== 'FREE' && (
                    <Crown className={`w-6 h-6 ${
                      activeSubscription.plan.name === 'PRO_PLUS' ? 'text-purple-400' :
                      activeSubscription.plan.name === 'PRO' ? 'text-blue-400' :
                      'text-orange-400'
                    }`} />
                  )}
                  <h3 className="text-2xl font-bold text-white" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '700' }}>
                    Active {formatPlanName(activeSubscription.plan.name)} Plan
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    isExpiringSoon 
                      ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
                      : 'bg-green-500/20 text-green-400 border border-green-500/50'
                  }`} style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}>
                    {isExpired ? 'Expired' : isExpiringSoon ? 'Expiring Soon' : 'Active'}
                  </span>
                </div>
                
                <div className="space-y-2 text-white/90">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-white/70" />
                    <span className="text-sm" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                      <strong>Started:</strong> {formatDate(subscriptionStartDate)}
                    </span>
                  </div>
                  {subscriptionEndDate ? (
                    <>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-white/70" />
                        <span className="text-sm" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                          <strong>Valid Until:</strong> {formatDate(subscriptionEndDate)}
                        </span>
                      </div>
                      {daysRemaining !== null && daysRemaining > 0 && (
                        <div className={`flex items-center gap-2 ${isExpiringSoon ? 'text-yellow-300' : 'text-white/90'}`}>
                          <Clock className={`w-4 h-4 ${isExpiringSoon ? 'text-yellow-400' : 'text-white/70'}`} />
                          <span className={`text-sm font-medium ${isExpiringSoon ? 'text-yellow-300' : ''}`} style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '500' }}>
                            {daysRemaining} day{daysRemaining !== 1 ? 's' : ''} remaining
                          </span>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex items-center gap-2 text-green-300">
                      <Check className="w-4 h-4" />
                      <span className="text-sm font-medium" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '500' }}>
                        Lifetime Plan
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex-shrink-0">
                <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                  <p className="text-xs text-white/70 mb-2" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                    Purchase Status
                  </p>
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-yellow-400" />
                    <p className="text-sm font-medium text-yellow-300" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}>
                      {isLifetime 
                        ? 'Lifetime plan active - No additional purchase needed'
                        : 'Cannot purchase until validity completes'}
                    </p>
                  </div>
                  {subscriptionEndDate && !isLifetime && (
                    <p className="text-xs text-white/60 mt-2" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                      Available after {formatDate(subscriptionEndDate)}
                    </p>
                  )}
                  {isLifetime && (
                    <p className="text-xs text-green-300 mt-2" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                      You have unlimited access
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => {
            const isElectric = hoveredCard === index;
            const CardContent = (
              <div 
                className="relative bg-black/10 backdrop-blur-sm rounded-2xl p-8 transition-all duration-500 hover:scale-105 group cursor-pointer"
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => {
                  const popularIndex = plans.findIndex((p) => p.popular)
                  setHoveredCard(popularIndex >= 0 ? popularIndex : 0)
                }}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-medium" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '500' }}>
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Plan Header */}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-white group-hover:text-white mb-2" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}>{plan.name}</h3>
                  <p className="text-white/80 group-hover:text-white/90 text-sm mb-6" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>{plan.description}</p>

                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-4xl font-bold text-white group-hover:text-white" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '700' }}>${plan.price[billingCycle]}</span>
                    <span className="text-white/70 group-hover:text-white/90" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>/ {billingCycle === "monthly" ? "month" : "year"}</span>
                    {billingCycle === "yearly" && plan.price.yearly > 0 && (
                      <span className="bg-orange-500 text-white px-2 py-1 rounded text-xs ml-2" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '500' }}>Save</span>
                    )}
                  </div>
                </div>

                {/* Features */}
                <div className="mb-8">
                  <h4 className="text-white group-hover:text-white font-medium mb-4" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '500' }}>What's included</h4>
                  <ul className="space-y-3">
                    {plan.features.length > 0 ? (
                      plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-3 text-white/90 group-hover:text-white">
                          <div className="w-5 h-5 rounded-full flex items-center justify-center bg-orange-500 group-hover:bg-white transition-all duration-300">
                            <Check className="w-3 h-3 text-white group-hover:text-orange-500" />
                          </div>
                          <span className="text-sm" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>{feature}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-white/60 text-sm">No features listed</li>
                    )}
                  </ul>
                </div>

                {/* Active Subscription Warning */}
                {hasActiveSubscription && (
                  <div className="mb-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <Lock className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-yellow-400 font-medium mb-1">
                          Active Subscription
                        </p>
                        <p className="text-xs text-yellow-300/80">
                          {isLifetime 
                            ? 'Lifetime plan active. Cannot purchase additional plans.'
                            : `Valid until ${subscriptionEndDate?.toLocaleDateString()}. Cannot purchase until expiry.`}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Subscribe Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    if (hasActiveSubscription) {
                      e.preventDefault()
                      e.stopPropagation()
                      console.log('[Pricing] Button blocked - Active subscription:', hasActiveSubscription)
                      return false
                    }
                    console.log('[Pricing] Button clicked:', { planId: plan.id, hasActiveSubscription })
                    handlePlanClick(plan.id, e)
                  }}
                  disabled={hasActiveSubscription}
                  aria-disabled={hasActiveSubscription}
                  tabIndex={hasActiveSubscription ? -1 : 0}
                  className={`w-full py-3 rounded-lg font-medium transition-all duration-300 ${
                    hasActiveSubscription
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-60'
                      : 'group-hover:scale-105 bg-orange-500 text-white cursor-pointer hover:bg-orange-600'
                  } flex items-center justify-center`}
                  style={{ 
                    fontFamily: 'Orbitron, sans-serif', 
                    fontWeight: '600',
                    pointerEvents: hasActiveSubscription ? 'none' : 'auto'
                  }}
                >
                  {hasActiveSubscription ? (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      {isLifetime ? 'Lifetime Plan Active' : 'Subscription Active'}
                    </>
                  ) : (
                    <>
                      {plan.buttonText}
                      <svg
                        className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            );

            return isElectric ? (
              <ElectricBorder
                key={plan.id}
                color="#ff7b00"
                speed={1}
                chaos={0.5}
                thickness={2}
                className=""
                style={{ borderRadius: 16 }}
              >
                {CardContent}
              </ElectricBorder>
            ) : (
              <div key={plan.id}>
                {CardContent}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  )
}
