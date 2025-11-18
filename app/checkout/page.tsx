"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { Check, Lock, CreditCard, Shield, ArrowLeft, User, Mail, Phone, Building, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SharedNavbar } from "@/components/shared-navbar"
import { FooterSection } from "@/components/footer-section"
import { getActivePlans, type ServicePlan } from "@/lib/api/website"
import { useRazorpay } from "@/hooks/use-razorpay"
import Cookies from "js-cookie"

function CheckoutContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const planId = searchParams.get('planId')
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")
  const [discountPercent, setDiscountPercent] = useState<number | null>(null)
  const { initiatePayment, isLoading: paymentLoading } = useRazorpay()

  // Get discount from URL parameter or sessionStorage
  useEffect(() => {
    // First check URL parameter
    const urlParams = new URLSearchParams(window.location.search)
    const urlDiscount = urlParams.get('discount')
    if (urlDiscount) {
      const discountNum = parseInt(urlDiscount, 10)
      if (!isNaN(discountNum) && discountNum > 0 && discountNum <= 100) {
        setDiscountPercent(discountNum)
        sessionStorage.setItem('discountPercent', discountNum.toString())
        return
      }
    }
    
    // Fallback to sessionStorage
    const discount = sessionStorage.getItem('discountPercent')
    if (discount) {
      const discountNum = parseInt(discount, 10)
      if (!isNaN(discountNum) && discountNum > 0 && discountNum <= 100) {
        setDiscountPercent(discountNum)
      }
    }
  }, [])

  // Fetch active service plans
  const { data: plansData = [], isLoading } = useQuery({
    queryKey: ['activePlans'],
    queryFn: getActivePlans,
  })

  // Find the selected plan
  const selectedPlan = plansData.find((plan: ServicePlan) => plan.id === planId)

  // Get user details from cookies/localStorage
  const [userDetails, setUserDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  })

  // Load user details on component mount
  useEffect(() => {
    const loadUserDetails = () => {
      const firstName = localStorage.getItem('userFirstName') || ''
      const lastName = localStorage.getItem('userLastName') || ''
      const email = localStorage.getItem('userEmail') || Cookies.get('userEmail') || ''
      const phone = localStorage.getItem('userPhone') || ''

      setUserDetails({
        firstName,
        lastName,
        email,
        phone,
      })
    }

    loadUserDetails()
  }, [])

  // Calculate price with discount
  const baseMonthlyPrice = selectedPlan?.price || 0
  const baseYearlyPrice = selectedPlan ? Math.round(selectedPlan.price * 12 * 0.9) : 0
  
  const applyDiscount = (price: number): number => {
    if (discountPercent && discountPercent > 0 && discountPercent <= 100) {
      return Math.round(price * (1 - discountPercent / 100))
    }
    return price
  }
  
  const monthlyPrice = applyDiscount(baseMonthlyPrice)
  const yearlyPrice = applyDiscount(baseYearlyPrice)
  const finalPrice = billingCycle === "monthly" ? monthlyPrice : yearlyPrice

  // Redirect if no plan selected
  useEffect(() => {
    if (!isLoading && !selectedPlan && planId) {
      router.push('/pricing')
    }
  }, [isLoading, selectedPlan, planId, router])

  const handlePayment = async () => {
    if (!planId || !selectedPlan) {
      return
    }

    // Prepare user details for Razorpay
    const fullName = `${userDetails.firstName} ${userDetails.lastName}`.trim()

    // Pass the discounted final price and discount percentage
    await initiatePayment(
      planId,
      {
        name: fullName || undefined,
        email: userDetails.email || undefined,
        contact: userDetails.phone || undefined,
      },
      finalPrice, // Pass the discounted amount
      discountPercent || undefined // Pass the discount percentage
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col" style={{
        backgroundImage: "url('/hero/middle-1.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}>
        <SharedNavbar />
        <div className="flex-1 flex items-center justify-center pt-24">
          <div className="text-white text-xl">Loading...</div>
        </div>
      </div>
    )
  }

  if (!selectedPlan) {
    return (
      <div className="min-h-screen flex flex-col" style={{
        backgroundImage: "url('/hero/middle-1.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}>
        <SharedNavbar />
        <div className="flex-1 flex items-center justify-center pt-24">
          <div className="text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Plan not found</h2>
            <Button onClick={() => router.push('/pricing')} className="bg-orange-500 hover:bg-orange-600">
              View Plans
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{
        backgroundImage: "url('/hero/middle-1.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      <SharedNavbar />
      <div className="flex-1 pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <Button
            onClick={() => router.push('/pricing')}
            variant="ghost"
            className="mb-6 text-white hover:text-orange-400 hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Plans
          </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 p-8">
              <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '700' }}>
                Complete Your Purchase
              </h1>
              <p className="text-white/70 mb-8" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                Secure checkout powered by industry-leading encryption
              </p>

              {/* Billing Cycle Toggle */}
              <div className="mb-8 p-4 bg-white/5 rounded-xl border border-white/10">
                <label className="block text-white text-sm font-medium mb-3" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '500' }}>
                  Billing Cycle
                </label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setBillingCycle("monthly")}
                    className={`flex-1 py-3 px-4 rounded-lg transition-all ${
                      billingCycle === "monthly"
                        ? "bg-orange-500 text-white"
                        : "bg-white/5 text-white/70 hover:bg-white/10"
                    }`}
                    style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}
                  >
                    Monthly
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingCycle("yearly")}
                    className={`flex-1 py-3 px-4 rounded-lg transition-all ${
                      billingCycle === "yearly"
                        ? "bg-orange-500 text-white"
                        : "bg-white/5 text-white/70 hover:bg-white/10"
                    }`}
                    style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}
                  >
                    Yearly
                    {billingCycle === "yearly" && (
                      <span className="ml-2 text-xs bg-white/20 px-2 py-0.5 rounded">Save 10%</span>
                    )}
                  </button>
                </div>
              </div>

              {/* User Information Display */}
              <div className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-white flex items-center gap-2" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}>
                    <User className="w-5 h-5 text-orange-500" />
                    Account Information
                  </h2>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-white/60 text-sm mb-1" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                          Name
                        </label>
                        <p className="text-white font-medium" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '500' }}>
                          {userDetails.firstName || userDetails.lastName
                            ? `${userDetails.firstName} ${userDetails.lastName}`.trim()
                            : 'Not provided'
                          }
                        </p>
                      </div>
                      <div>
                        <label className="block text-white/60 text-sm mb-1" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                          Email
                        </label>
                        <p className="text-white font-medium" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '500' }}>
                          {userDetails.email || 'Not provided'}
                        </p>
                      </div>
                    </div>

                    {userDetails.phone && (
                      <div className="mt-4">
                        <label className="block text-white/60 text-sm mb-1" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                          Phone
                        </label>
                        <p className="text-white font-medium" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '500' }}>
                          {userDetails.phone}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Payment Method */}
                <div className="space-y-4 pt-6 border-t border-white/10">
                  <h2 className="text-xl font-semibold text-white flex items-center gap-2" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}>
                    <CreditCard className="w-5 h-5 text-orange-500" />
                    Payment Method
                  </h2>

                  <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                          <CreditCard className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}>
                            Razorpay Secure Checkout
                          </h3>
                          <p className="text-white/70 text-sm" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                            Pay securely with UPI, Cards, Net Banking & Wallets
                          </p>
                        </div>
                      </div>
                      <div className="text-orange-500">
                        <Shield className="w-8 h-8" />
                      </div>
                    </div>
                  </div>

                  {/* Security Features */}
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2 p-3 bg-white/5 rounded-lg border border-white/10">
                      <Lock className="w-4 h-4 text-orange-500" />
                      <span className="text-white/70 text-sm" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                        SSL Encrypted
                      </span>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-white/5 rounded-lg border border-white/10">
                      <Shield className="w-4 h-4 text-orange-500" />
                      <span className="text-white/70 text-sm" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                        PCI Compliant
                      </span>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-white/5 rounded-lg border border-white/10">
                      <Check className="w-4 h-4 text-orange-500" />
                      <span className="text-white/70 text-sm" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                        Money Back Guarantee
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment Button */}
                <Button
                  onClick={handlePayment}
                  disabled={paymentLoading}
                  className="w-full py-6 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '700' }}
                >
                  {paymentLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5 mr-2" />
                      Pay with Razorpay
                    </>
                  )}
                </Button>

                {/* Terms and Conditions */}
                <div className="text-center text-white/60 text-sm" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                  By completing your purchase, you agree to our{' '}
                  <a href="/terms" className="text-orange-500 hover:text-orange-400 underline">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="/privacy" className="text-orange-500 hover:text-orange-400 underline">
                    Privacy Policy
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-white mb-6" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}>
                Order Summary
              </h2>

              {/* Plan Details */}
              <div className="mb-6 p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-white" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}>
                      {selectedPlan.name} Plan
                    </h3>
                    <p className="text-white/60 text-sm mt-1" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                      {selectedPlan.description}
                    </p>
                  </div>
                  {selectedPlan.isPopular && (
                    <span className="bg-orange-500 text-white px-2 py-1 rounded text-xs font-medium" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '500' }}>
                      Popular
                    </span>
                  )}
                </div>

                {/* Features List */}
                <div className="space-y-2 mt-4">
                  <p className="text-white/80 text-sm font-medium mb-2" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '500' }}>
                    What's included:
                  </p>
                  {selectedPlan.features.slice(0, 5).map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-white/70 text-sm">
                      <Check className="w-4 h-4 text-orange-500 flex-shrink-0" />
                      <span style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>{feature}</span>
                    </div>
                  ))}
                  {selectedPlan.features.length > 5 && (
                    <p className="text-white/50 text-xs mt-2" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                      + {selectedPlan.features.length - 5} more features
                    </p>
                  )}
                </div>
              </div>

              {/* Pricing Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-white/80">
                  <span style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                    {billingCycle === "monthly" ? "Monthly" : "Yearly"} Plan
                  </span>
                  <div className="flex items-center gap-2">
                    {discountPercent && (
                      <span className="line-through text-white/40 text-sm" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                        ${billingCycle === "monthly" ? baseMonthlyPrice : baseYearlyPrice}
                      </span>
                    )}
                    <span style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}>
                      ${billingCycle === "monthly" ? monthlyPrice : yearlyPrice}
                    </span>
                  </div>
                </div>
                {discountPercent && discountPercent > 0 && (
                  <div className="flex justify-between text-orange-400">
                    <span style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                      Special Offer Discount ({discountPercent}%)
                    </span>
                    <span style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}>
                      -${Math.round((billingCycle === "monthly" ? baseMonthlyPrice : baseYearlyPrice) * (discountPercent / 100))}
                    </span>
                  </div>
                )}
                {billingCycle === "yearly" && !discountPercent && (
                  <div className="flex justify-between text-orange-400">
                    <span style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                      Yearly Discount (10%)
                    </span>
                    <span style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}>
                      -${Math.round(selectedPlan.price * 12 * 0.1)}
                    </span>
                  </div>
                )}
                <div className="pt-3 border-t border-white/10">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-white" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}>
                      Total
                    </span>
                    <span className="text-2xl font-bold text-orange-500" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '700' }}>
                      ${finalPrice}
                    </span>
                  </div>
                  <p className="text-white/50 text-xs mt-1" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                    {billingCycle === "monthly" ? "per month" : "per year"}
                  </p>
                </div>
              </div>

              {/* Security Features */}
              <div className="pt-6 border-t border-white/10">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-5 h-5 text-orange-500" />
                  <span className="text-white/80 text-sm font-medium" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '500' }}>
                    Secure Payment
                  </span>
                </div>
                <ul className="space-y-2 text-white/60 text-xs">
                  <li className="flex items-center gap-2">
                    <Check className="w-3 h-3 text-orange-500" />
                    <span style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>256-bit SSL encryption</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3 h-3 text-orange-500" />
                    <span style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>PCI DSS compliant</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3 h-3 text-orange-500" />
                    <span style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>Money-back guarantee</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
      <FooterSection />
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col" style={{
        backgroundImage: "url('/hero/middle-1.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}>
        <SharedNavbar />
        <div className="flex-1 flex items-center justify-center pt-24">
          <div className="text-white text-xl">Loading...</div>
        </div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  )
}

