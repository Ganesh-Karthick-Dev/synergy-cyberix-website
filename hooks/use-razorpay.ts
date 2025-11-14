import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'

declare global {
  interface Window {
    Razorpay: any
  }
}

export interface PaymentOrder {
  id: string
  razorpayOrderId: string
  amount: number
  currency: string
  status: string
  key: string
  plan: {
    id: string
    name: string
    price: number
    description: string
    features: string[]
    isPopular: boolean
  }
}

export interface RazorpayOptions {
  key: string
  amount: number
  currency: string
  name: string
  description: string
  order_id: string
  handler: (response: RazorpayResponse) => void
  prefill: {
    name?: string
    email?: string
    contact?: string
  }
  notes: {
    address?: string
  }
  theme: {
    color: string
  }
  modal: {
    ondismiss: () => void
  }
}

export interface RazorpayResponse {
  razorpay_payment_id: string
  razorpay_order_id: string
  razorpay_signature: string
}

export const useRazorpay = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  /**
   * Load Razorpay script dynamically
   */
  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true)
        return
      }

      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  /**
   * Create payment order
   */
  const createPaymentOrder = async (planId: string, amount?: number, discountPercent?: number): Promise<PaymentOrder | null> => {
    try {
      setIsLoading(true)
      setError(null)

      console.log('[Razorpay Hook] ===== CREATING PAYMENT ORDER =====')
      console.log('[Razorpay Hook] Plan ID:', planId)
      console.log('[Razorpay Hook] Amount:', amount)
      console.log('[Razorpay Hook] Discount:', discountPercent)
      console.log('[Razorpay Hook] Calling /api/payments/create-order')

      const requestBody: any = { planId }
      if (amount !== undefined) {
        requestBody.amount = amount
      }
      if (discountPercent !== undefined) {
        requestBody.discountPercent = discountPercent
      }

      const response = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies
        body: JSON.stringify(requestBody),
      })

      console.log('[Razorpay Hook] Response status:', response.status)
      console.log('[Razorpay Hook] Response ok:', response.ok)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error?.message || 'Failed to create payment order')
      }

      const data = await response.json()
      return data.data
    } catch (err: any) {
      setError(err.message)
      toast({
        title: 'Payment Error',
        description: err.message,
        variant: 'destructive',
      })
      return null
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Verify payment
   */
  const verifyPayment = async (razorpayResponse: RazorpayResponse): Promise<{ verified: boolean; paymentId?: string }> => {
    try {
      console.log('[Razorpay Hook] ===== VERIFYING PAYMENT =====')
      console.log('[Razorpay Hook] Order ID:', razorpayResponse.razorpay_order_id)
      console.log('[Razorpay Hook] Payment ID:', razorpayResponse.razorpay_payment_id)
      console.log('[Razorpay Hook] Calling /api/payments/verify')

      const response = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies
        body: JSON.stringify({
          razorpayOrderId: razorpayResponse.razorpay_order_id,
          razorpayPaymentId: razorpayResponse.razorpay_payment_id,
          razorpaySignature: razorpayResponse.razorpay_signature,
        }),
      })

      console.log('[Razorpay Hook] Verify response status:', response.status)
      console.log('[Razorpay Hook] Verify response ok:', response.ok)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error?.message || 'Payment verification failed')
      }

      const data = await response.json()
      console.log('[Razorpay Hook] ✅ Payment verified, payment record ID:', data.data?.paymentId)
      return {
        verified: data.success,
        paymentId: data.data?.paymentId
      }
    } catch (err: any) {
      console.error('[Razorpay Hook] ❌ Payment verification failed:', err)
      setError(err.message)
      return { verified: false }
    }
  }

  /**
   * Initialize Razorpay payment
   */
  const initiatePayment = async (planId: string, userDetails?: {
    name?: string
    email?: string
    contact?: string
  }, amount?: number, discountPercent?: number) => {
    try {
      setIsLoading(true)
      setError(null)

      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript()
      if (!scriptLoaded) {
        throw new Error('Failed to load Razorpay SDK')
      }

      // Create payment order with discounted amount if provided
      const order = await createPaymentOrder(planId, amount, discountPercent)
      if (!order) {
        throw new Error('Failed to create payment order')
      }

      // Configure Razorpay options
      const options: RazorpayOptions = {
        key: order.key,
        amount: order.amount,
        currency: order.currency,
        name: 'Cyberix Security',
        description: `Subscription to ${order.plan.name}`,
        order_id: order.razorpayOrderId,
        handler: async (response: RazorpayResponse) => {
          // Verify payment
          const verificationResult = await verifyPayment(response)

          if (verificationResult.verified && verificationResult.paymentId) {
            // Redirect to success page with internal payment record ID
            router.push(`/payment/success?payment_id=${verificationResult.paymentId}&order_id=${response.razorpay_order_id}`)
          } else {
            // Redirect to failure page
            router.push(`/payment/failure?payment_id=${response.razorpay_payment_id}&order_id=${response.razorpay_order_id}&reason=verification_failed`)
          }
        },
        prefill: {
          name: userDetails?.name,
          email: userDetails?.email,
          contact: userDetails?.contact,
        },
        notes: {
          address: 'Cyberix Security Subscription',
        },
        theme: {
          color: '#ff7b00',
        },
        modal: {
          ondismiss: () => {
            toast({
              title: 'Payment Cancelled',
              description: 'You cancelled the payment process.',
            })
          },
        },
      }

      // Open Razorpay checkout
      const rzp = new window.Razorpay(options)
      rzp.open()

    } catch (err: any) {
      setError(err.message)
      toast({
        title: 'Payment Error',
        description: err.message,
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return {
    initiatePayment,
    isLoading,
    error,
  }
}
