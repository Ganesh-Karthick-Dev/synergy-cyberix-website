"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { XCircle, RefreshCw, ArrowLeft, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SharedNavbar } from "@/components/shared-navbar"
import { FooterSection } from "@/components/footer-section"

function PaymentFailureContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [countdown, setCountdown] = useState(30)

  const paymentId = searchParams.get('payment_id')
  const orderId = searchParams.get('order_id')
  const reason = searchParams.get('reason') || 'Unknown error'

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleRetryPayment = () => {
    // Extract plan ID from localStorage or redirect to pricing
    const selectedPlanId = localStorage.getItem('selectedPlanId')
    if (selectedPlanId) {
      router.push(`/checkout?planId=${selectedPlanId}`)
    } else {
      router.push('/pricing')
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{
      backgroundImage: "url('/hero/middle-1.png')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat"
    }}>
      <SharedNavbar />
      <div className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="max-w-2xl mx-auto text-center">
          {/* Failure Icon */}
          <div className="mb-8">
            <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '700' }}>
              Payment Failed
            </h1>
            <p className="text-white/80 text-lg mb-8" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
              We couldn't process your payment. Don't worry, no charges have been made to your account.
            </p>
          </div>

          {/* Error Details */}
          <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 p-8 mb-8">
            <h2 className="text-2xl font-semibold text-white mb-6" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}>
              What Happened?
            </h2>

            <div className="space-y-4 text-left">
              <div className="flex justify-between items-center py-3 border-b border-white/10">
                <span className="text-white/70" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                  Payment ID
                </span>
                <span className="text-white font-mono text-sm" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '500' }}>
                  {paymentId || 'N/A'}
                </span>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-white/10">
                <span className="text-white/70" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                  Order ID
                </span>
                <span className="text-white font-mono text-sm" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '500' }}>
                  {orderId || 'N/A'}
                </span>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-white/10">
                <span className="text-white/70" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                  Status
                </span>
                <span className="text-red-400 font-semibold" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}>
                  FAILED
                </span>
              </div>

              <div className="py-3">
                <span className="text-white/70 block mb-2" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                  Reason
                </span>
                <span className="text-white font-medium" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '500' }}>
                  {reason}
                </span>
              </div>
            </div>
          </div>

          {/* Common Issues */}
          <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 p-8 mb-8">
            <h3 className="text-xl font-semibold text-white mb-6" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}>
              Common Issues & Solutions
            </h3>

            <div className="space-y-4 text-left">
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h4 className="text-white font-semibold mb-2" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '500' }}>
                  Insufficient Funds
                </h4>
                <p className="text-white/70 text-sm" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                  Check your account balance or try a different payment method.
                </p>
              </div>

              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h4 className="text-white font-semibold mb-2" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '500' }}>
                  Card Declined
                </h4>
                <p className="text-white/70 text-sm" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                  Contact your bank or try a different card/UPI ID.
                </p>
              </div>

              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h4 className="text-white font-semibold mb-2" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '500' }}>
                  Network Issues
                </h4>
                <p className="text-white/70 text-sm" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                  Check your internet connection and try again.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button
              onClick={handleRetryPayment}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3"
              style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>

            <Button
              onClick={() => router.push('/pricing')}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 px-8 py-3"
              style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Plans
            </Button>
          </div>

          {/* Support */}
          <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 p-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <HelpCircle className="w-6 h-6 text-orange-500" />
              <h3 className="text-xl font-semibold text-white" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}>
                Need Help?
              </h3>
            </div>
            <p className="text-white/70 text-sm mb-4" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
              If you're still having issues, our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={() => window.open('mailto:support@cyberix.com', '_blank')}
                variant="outline"
                size="sm"
                className="border-white/20 text-white hover:bg-white/10"
                style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '500' }}
              >
                Email Support
              </Button>
              <Button
                onClick={() => router.push('/contact')}
                variant="outline"
                size="sm"
                className="border-white/20 text-white hover:bg-white/10"
                style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '500' }}
              >
                Contact Us
              </Button>
            </div>
          </div>

          {/* Auto Redirect Notice */}
          <div className="mt-8 text-white/60 text-sm" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
            Page will refresh in {countdown} seconds...
          </div>
        </div>
      </div>
      <FooterSection />
    </div>
  )
}

export default function PaymentFailurePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col" style={{
        backgroundImage: "url('/hero/middle-1.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}>
        <SharedNavbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-white text-xl">Loading...</div>
        </div>
      </div>
    }>
      <PaymentFailureContent />
    </Suspense>
  )
}
