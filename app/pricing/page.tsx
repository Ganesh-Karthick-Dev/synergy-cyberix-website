"use client"

import { useState, useEffect, useRef } from "react"
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

export default function PricingPage() {
  const router = useRouter()
  const sectionRef = useRef<HTMLElement>(null)
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const { openRegisterModal } = useAuth()

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
  const plans = plansData.map((plan: ServicePlan, index: number) => {
    const yearlyPrice = Math.round(plan.price * 12 * 0.9) // 10% discount for yearly
    
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
        <div className="text-center mb-8 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
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

                {/* Subscribe Button */}
                <button
                  onClick={(e) => handlePlanClick(plan.id, e)}
                  className="w-full py-3 rounded-lg font-medium transition-all duration-300 group-hover:scale-105 bg-orange-500 text-white flex items-center justify-center cursor-pointer" 
                  style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}
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
      
      {/* FAQ Section */}
      <div className="-mt-8">
        <FAQSection />
      </div>
      
      <FooterSection />
    </div>
  )
}

