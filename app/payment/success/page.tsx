"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { CheckCircle, ArrowRight, Home, Receipt } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SharedNavbar } from "@/components/shared-navbar"
import { FooterSection } from "@/components/footer-section"

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [countdown, setCountdown] = useState(10)

  const paymentId = searchParams.get('payment_id')
  const orderId = searchParams.get('order_id')

  const downloadInvoice = async () => {
    if (!paymentId) {
      alert('Payment ID not found. Cannot download invoice.')
      return
    }

    try {
      const response = await fetch(`/api/payments/invoice/${paymentId}`, {
        method: 'GET',
        credentials: 'include'
      })

      if (!response.ok) {
        const errorData = await response.json()
        alert(`Failed to download invoice: ${errorData.error?.message || 'Unknown error'}`)
        return
      }

      // Create a blob from the response
      const blob = await response.blob()

      // Create a download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `invoice-${paymentId.slice(-8)}.pdf`
      document.body.appendChild(link)
      link.click()

      // Clean up
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading invoice:', error)
      alert('Failed to download invoice. Please try again.')
    }
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          router.push('/profile?tab=subscription')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

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
          {/* Success Icon */}
          <div className="mb-8">
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '700' }}>
              Payment Successful!
            </h1>
            <p className="text-white/80 text-lg mb-8" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
              Your subscription has been activated successfully. Welcome to Cyberix Security!
            </p>
          </div>

          {/* Payment Details */}
          <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 p-8 mb-8">
            <h2 className="text-2xl font-semibold text-white mb-6" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}>
              Payment Details
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

              <div className="flex justify-between items-center py-3">
                <span className="text-white/70" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                  Status
                </span>
                <span className="text-green-400 font-semibold" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}>
                  COMPLETED
                </span>
              </div>
            </div>
          </div>

          {/* What's Next */}
          <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 p-8 mb-8">
            <h3 className="text-xl font-semibold text-white mb-6" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}>
              What's Next?
            </h3>

            <div className="space-y-4 text-left">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm font-bold">1</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '500' }}>
                    Access Your Dashboard
                  </h4>
                  <p className="text-white/70 text-sm" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                    Visit your profile to manage your subscription and access all features.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm font-bold">2</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '500' }}>
                    Start Using Cyberix
                  </h4>
                  <p className="text-white/70 text-sm" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                    Begin exploring our security tools and features.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm font-bold">3</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '500' }}>
                    Get Support
                  </h4>
                  <p className="text-white/70 text-sm" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                    Need help? Contact our support team anytime.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => router.push('/profile?tab=subscription')}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3"
              style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}
            >
              <Receipt className="w-4 h-4 mr-2" />
              View Subscription
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            <Button
              onClick={downloadInvoice}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 px-8 py-3"
              style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}
            >
              <Receipt className="w-4 h-4 mr-2" />
              Download Invoice
            </Button>

            <Button
              onClick={() => router.push('/download')}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 px-8 py-3"
              style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}
            >
              <Home className="w-4 h-4 mr-2" />
              Download Software
            </Button>
          </div>

          {/* Auto Redirect Notice */}
          <div className="mt-8 text-white/60 text-sm" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
            Redirecting to your dashboard in {countdown} seconds...
          </div>
        </div>
      </div>
      <FooterSection />
    </div>
  )
}
