"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"
import { Check } from "lucide-react"
import ElectricBorder from '@/components/ElectricBorder.jsx'
import { SharedNavbar } from "@/components/shared-navbar"
import { FooterSection } from "@/components/footer-section"
import { FAQSection } from "@/components/faq-section"
import { useAuth } from "@/components/auth-context"
import { getActivePlans, type ServicePlan } from "@/lib/api/website"

async function fetchActiveSubscription() {
  try {
    console.log('[Pricing Page] Fetching active subscription...')
    const response = await fetch('/api/subscription/active', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      cache: 'no-store'
    })

    console.log('[Pricing Page] Subscription API response status:', response.status)

    if (!response.ok) {
      console.log('[Pricing Page] Subscription API error:', response.status)
      return null
    }

    const data = await response.json()
    console.log('[Pricing Page] Subscription API response data:', data)
    const subscription = data.data || null
    console.log('[Pricing Page] Parsed subscription:', subscription)
    return subscription
  } catch (error) {
    console.error('[Pricing Page] Error fetching subscription:', error)
    return null
  }
}

export default function PricingPage() {
  const router = useRouter()
  const sectionRef = useRef<HTMLElement>(null)
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const { openRegisterModal } = useAuth()
  const [discountPercent, setDiscountPercent] = useState<number | null>(null)

  // Get discount from URL parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const discount = params.get('discount')
    if (discount) {
      const discountNum = parseInt(discount, 10)
      if (!isNaN(discountNum) && discountNum > 0 && discountNum <= 100) {
        setDiscountPercent(discountNum)
        // Store in sessionStorage for checkout page
        sessionStorage.setItem('discountPercent', discountNum.toString())
      }
    }
  }, [])

  // Fetch active subscription
  const { data: activeSubscription } = useQuery({
    queryKey: ['activeSubscription', 'pricing-page'],
    queryFn: fetchActiveSubscription,
    enabled: true,
    refetchInterval: 60000,
    retry: false,
    staleTime: 0,
  })

  // Check if subscription is active and valid
  const subscriptionState = useMemo(() => {
    if (!activeSubscription) {
      return {
        hasActiveSubscription: false,
        subscriptionEndDate: null,
        isLifetime: false,
        isExpired: false,
      }
    }

    const endDate = activeSubscription.endDate ? new Date(activeSubscription.endDate) : null
    const isLifetime = activeSubscription.endDate === null
    const now = new Date()
    const isExpired = endDate ? endDate <= now : false
    
    const hasActive = activeSubscription.status === 'ACTIVE' && (isLifetime || !isExpired)
    
    return {
      hasActiveSubscription: hasActive,
      subscriptionEndDate: endDate,
      isLifetime,
      isExpired,
    }
  }, [activeSubscription])

  const { hasActiveSubscription, subscriptionEndDate, isLifetime } = subscriptionState

  // Debug logging
  useEffect(() => {
    console.log('[Pricing Page] Subscription Check:', {
      hasSubscriptionData: !!activeSubscription,
      subscriptionData: activeSubscription,
      status: activeSubscription?.status,
      endDate: activeSubscription?.endDate,
      hasActiveSubscription,
      willDisableButtons: hasActiveSubscription
    })
  }, [activeSubscription, hasActiveSubscription])

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
    
    // If user has active subscription, redirect to profile subscription page
    if (hasActiveSubscription && isLoggedIn) {
      router.push('/profile?tab=subscription')
      return
    }
    
    if (isLoggedIn) {
      // If logged in, go directly to checkout with discount if available
      const checkoutUrl = discountPercent 
        ? `/checkout?planId=${planId}&discount=${discountPercent}`
        : `/checkout?planId=${planId}`
      router.push(checkoutUrl)
    } else {
      // If not logged in, store planId and discount, then open registration modal
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('selectedPlanId', planId)
        if (discountPercent) {
          sessionStorage.setItem('discountPercent', discountPercent.toString())
        }
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
  const plans = plansData.map((plan: ServicePlan, index: number) => {
    // Calculate base prices
    const baseMonthlyPrice = plan.price
    const baseYearlyPrice = Math.round(plan.price * 12 * 0.9) // 10% discount for yearly
    
    // Apply discount if available
    const applyDiscount = (price: number): number => {
      if (discountPercent && discountPercent > 0 && discountPercent <= 100) {
        return Math.round(price * (1 - discountPercent / 100))
      }
      return price
    }
    
    const monthlyPrice = applyDiscount(baseMonthlyPrice)
    const yearlyPrice = applyDiscount(baseYearlyPrice)
    
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
        monthly: monthlyPrice, 
        yearly: yearlyPrice,
        originalMonthly: baseMonthlyPrice,
        originalYearly: baseYearlyPrice
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


  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <SharedNavbar />
        <section 
          ref={sectionRef}
          className="flex-1 pt-24 pb-16 px-4 flex items-center justify-center"
          style={{
            backgroundImage: "url('/hero/middle-1.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat"
          }}
        >
          <div className="text-white text-xl">Loading plans...</div>
        </section>
        <FooterSection />
      </div>
    )
  }

  if (plans.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <SharedNavbar />
        <section 
          ref={sectionRef}
          className="flex-1 pt-24 pb-16 px-4"
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
        <FooterSection />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SharedNavbar />
      <section 
        ref={sectionRef}
        className="flex-1 pt-24 pb-8 px-4"
        style={{
          backgroundImage: "url('/hero/middle-1.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      >
        <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '700' }}>
            Choose the Plan
            <br />
            That's Right for You
          </h2>
          <p className="text-white/90 text-lg max-w-3xl mx-auto mb-6" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
            Giving you access to essential features and over 1,000 creative tools. Upgrade to the Pro Plan to unlock
            powerful AI capabilities, cloud syncing, and a whole new level of creative freedom.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-6 py-2 rounded-full transition-all duration-300 cursor-pointer ${
                billingCycle === "monthly" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              <span style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '500' }}>Monthly</span>
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-6 py-2 rounded-full transition-all duration-300 cursor-pointer ${
                billingCycle === "yearly" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              <span style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '500' }}>Yearly</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => {
            const isElectric = hoveredCard === index;
            const CardContent = (
              <div 
                className="relative bg-black/10 backdrop-blur-sm rounded-2xl p-8 transition-all duration-500 hover:scale-105 group"
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
                    {discountPercent && plan.price.originalMonthly && plan.price.originalMonthly > 0 && (
                      <span className="text-xl line-through text-white/50 group-hover:text-white/60 mr-2" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                        ${billingCycle === "monthly" ? plan.price.originalMonthly : plan.price.originalYearly}
                      </span>
                    )}
                    <span className="text-4xl font-bold text-white group-hover:text-white" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '700' }}>${plan.price[billingCycle]}</span>
                    <span className="text-white/70 group-hover:text-white/90" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>/ {billingCycle === "monthly" ? "month" : "year"}</span>
                    {discountPercent && discountPercent > 0 && (
                      <span className="bg-orange-500 text-white px-2 py-1 rounded text-xs ml-2" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '500' }}>
                        {discountPercent}% OFF
                      </span>
                    )}
                    {!discountPercent && billingCycle === "yearly" && plan.price.yearly > 0 && (
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

                {/* Subscribe Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    console.log('[Pricing Page] Button clicked:', { planId: plan.id })
                    handlePlanClick(plan.id, e)
                  }}
                  className="w-full py-3 rounded-lg font-medium transition-all duration-300 group-hover:scale-105 bg-orange-500 text-white cursor-pointer hover:bg-orange-600 flex items-center justify-center"
                  style={{ 
                    fontFamily: 'Orbitron, sans-serif', 
                    fontWeight: '600'
                  }}
                >
                  {plan.buttonText}
                  <svg
                    className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
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
  
      
      <FooterSection />
    </div>
  )
}

