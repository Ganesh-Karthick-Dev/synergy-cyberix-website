"use client"

import { useState, useEffect, useRef } from "react"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import ElectricBorder from './ElectricBorder'
import { useRegistration } from "@/components/registration-context"

export function PricingSection() {
  const sectionRef = useRef<HTMLElement>(null)

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
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")
  const [hoveredCard, setHoveredCard] = useState<number | null>(1) // Start with "Pro" (index 1) as default
  const { openModal } = useRegistration()

  const plans = [
    {
      name: "Security Starter",
      price: { monthly: 0, yearly: 0 },
      description: "Perfect for individuals and small teams getting started with security.",
      features: [
        "5 scans per month",
        "Basic vulnerability detection",
        "Standard PDF reports",
        "Email support",
        "Community access",
      ],
      buttonText: "Start Free Trial",
      popular: false,
    },
    {
      name: "Security Pro",
      price: { monthly: 49, yearly: 490 },
      description: "Comprehensive security for growing organizations.",
      features: [
        "Unlimited scans",
        "All 7 security modules",
        "Advanced AI detection",
        "Priority support",
        "API access",
        "Scheduled scanning",
        "Professional PDF reports",
      ],
      buttonText: "Upgrade to Pro",
      popular: true,
    },
    {
      name: "Security Command",
      price: { monthly: 199, yearly: 1990 },
      description: "Enterprise-grade security for large organizations.",
      features: [
        "Everything in Pro",
        "White-label reports",
        "Custom integrations",
        "Dedicated support",
        "Advanced analytics",
        "Team collaboration",
        "Compliance frameworks",
      ],
      buttonText: "Contact Sales",
      popular: false,
    },
  ]

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

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => {
            const isElectric = hoveredCard === index;
            const CardContent = (
              <div 
                className="relative bg-black/10 backdrop-blur-sm rounded-2xl p-8 transition-all duration-500 hover:scale-105 group cursor-pointer"
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(1)} // Return to "Pro" card when not hovering
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
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-3 text-white/90 group-hover:text-white">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center bg-orange-500 group-hover:bg-white transition-all duration-300">
                          <Check className="w-3 h-3 text-white group-hover:text-orange-500" />
                        </div>
                        <span className="text-sm" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Subscribe Button */}
                <div 
                  onClick={openModal}
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
                </div>
              </div>
            );

            return isElectric ? (
              <ElectricBorder
                key={plan.name}
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
              <div key={plan.name}>
                {CardContent}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  )
}
