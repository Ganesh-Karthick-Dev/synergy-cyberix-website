"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { Check, Lock, CreditCard, Shield, ArrowLeft, User, Mail, Phone, Building } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SharedNavbar } from "@/components/shared-navbar"
import { FooterSection } from "@/components/footer-section"
import { getActivePlans, type ServicePlan } from "@/lib/api/website"

export default function CheckoutPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const planId = searchParams.get('planId')
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")
  
  // Fetch active service plans
  const { data: plansData = [], isLoading } = useQuery({
    queryKey: ['activePlans'],
    queryFn: getActivePlans,
  })

  // Find the selected plan
  const selectedPlan = plansData.find((plan: ServicePlan) => plan.id === planId)

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  })

  // Calculate price
  const yearlyPrice = selectedPlan ? Math.round(selectedPlan.price * 12 * 0.9) : 0
  const finalPrice = billingCycle === "monthly" 
    ? (selectedPlan?.price || 0) 
    : yearlyPrice

  // Redirect if no plan selected
  useEffect(() => {
    if (!isLoading && !selectedPlan && planId) {
      router.push('/pricing')
    }
  }, [isLoading, selectedPlan, planId, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\s/g, '')
    if (value.length <= 16) {
      value = value.match(/.{1,4}/g)?.join(' ') || value
      setFormData(prev => ({ ...prev, cardNumber: value }))
    }
  }

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value.length <= 4) {
      if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2)
      }
      setFormData(prev => ({ ...prev, expiryDate: value }))
    }
  }

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value.length <= 3) {
      setFormData(prev => ({ ...prev, cvv: value }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle payment processing here
    console.log('Processing payment...', { planId, billingCycle, formData, finalPrice })
    // TODO: Integrate with payment gateway
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        backgroundImage: "url('/hero/middle-1.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}>
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!selectedPlan) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        backgroundImage: "url('/hero/middle-1.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}>
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Plan not found</h2>
          <Button onClick={() => router.push('/pricing')} className="bg-orange-500 hover:bg-orange-600">
            View Plans
          </Button>
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

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-white flex items-center gap-2" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}>
                    <User className="w-5 h-5 text-orange-500" />
                    Personal Information
                  </h2>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/80 text-sm mb-2" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '500' }}>
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block text-white/80 text-sm mb-2" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '500' }}>
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/80 text-sm mb-2 flex items-center gap-2" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '500' }}>
                        <Mail className="w-4 h-4 text-orange-500" />
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        placeholder="john.doe@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-white/80 text-sm mb-2 flex items-center gap-2" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '500' }}>
                        <Phone className="w-4 h-4 text-orange-500" />
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/80 text-sm mb-2 flex items-center gap-2" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '500' }}>
                      <Building className="w-4 h-4 text-orange-500" />
                      Company Name
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      placeholder="Acme Inc."
                    />
                  </div>
                </div>

                {/* Billing Address */}
                <div className="space-y-4 pt-6 border-t border-white/10">
                  <h2 className="text-xl font-semibold text-white flex items-center gap-2" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}>
                    <Shield className="w-5 h-5 text-orange-500" />
                    Billing Address
                  </h2>
                  
                  <div>
                    <label className="block text-white/80 text-sm mb-2" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '500' }}>
                      Street Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      placeholder="123 Main Street"
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-white/80 text-sm mb-2" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '500' }}>
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        placeholder="New York"
                      />
                    </div>
                    <div>
                      <label className="block text-white/80 text-sm mb-2" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '500' }}>
                        State *
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        placeholder="NY"
                      />
                    </div>
                    <div>
                      <label className="block text-white/80 text-sm mb-2" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '500' }}>
                        ZIP Code *
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        placeholder="10001"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/80 text-sm mb-2" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '500' }}>
                      Country *
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      placeholder="United States"
                    />
                  </div>
                </div>

                {/* Payment Information */}
                <div className="space-y-4 pt-6 border-t border-white/10">
                  <h2 className="text-xl font-semibold text-white flex items-center gap-2" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}>
                    <CreditCard className="w-5 h-5 text-orange-500" />
                    Payment Information
                  </h2>
                  
                  <div>
                    <label className="block text-white/80 text-sm mb-2" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '500' }}>
                      Card Number *
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleCardNumberChange}
                      required
                      maxLength={19}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      placeholder="1234 5678 9012 3456"
                    />
                  </div>

                  <div>
                    <label className="block text-white/80 text-sm mb-2" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '500' }}>
                      Cardholder Name *
                    </label>
                    <input
                      type="text"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      placeholder="JOHN DOE"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/80 text-sm mb-2" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '500' }}>
                        Expiry Date *
                      </label>
                      <input
                        type="text"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleExpiryChange}
                        required
                        maxLength={5}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        placeholder="MM/YY"
                      />
                    </div>
                    <div>
                      <label className="block text-white/80 text-sm mb-2" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '500' }}>
                        CVV *
                      </label>
                      <input
                        type="text"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleCvvChange}
                        required
                        maxLength={3}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        placeholder="123"
                      />
                    </div>
                  </div>

                  {/* Security Badge */}
                  <div className="flex items-center gap-2 p-4 bg-white/5 rounded-lg border border-white/10">
                    <Lock className="w-5 h-5 text-orange-500" />
                    <span className="text-white/70 text-sm" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                      Your payment information is encrypted and secure
                    </span>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full py-6 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '700' }}
                >
                  <Lock className="w-5 h-5 mr-2" />
                  Complete Secure Payment
                </Button>
              </form>
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
                  <span style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}>
                    ${billingCycle === "monthly" ? selectedPlan.price : yearlyPrice}
                  </span>
                </div>
                {billingCycle === "yearly" && (
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

