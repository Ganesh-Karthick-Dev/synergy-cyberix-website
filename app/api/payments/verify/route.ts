import { NextRequest, NextResponse } from 'next/server'
import { createServerApiClient } from '@/lib/api/server-client'

/**
 * Verify Payment API Route
 * Proxies request to backend server
 */
export async function POST(request: NextRequest) {
  try {
    // Get request body
    const body = await request.json()
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = body

    // Validate required fields
    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'All Razorpay payment details are required',
            statusCode: 400
          }
        },
        { status: 400 }
      )
    }

    const cookies = request.cookies
    const accessToken = cookies.get('accessToken')?.value

    if (!accessToken) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Authentication required',
            statusCode: 401
          }
        },
        { status: 401 }
      )
    }

    const apiClient = createServerApiClient(request)
    const response = await apiClient.post('/api/payments/verify', {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    })

    return NextResponse.json(
      {
        success: true,
        data: response.data.data,
        message: 'Payment verified successfully'
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('[Payment API] Error verifying payment:', error)
    const status = error.response?.status || 500
    const errorData = error.response?.data || {}
    
    return NextResponse.json(
      {
        success: false,
        error: {
          message: errorData.error?.message || error.message || 'Failed to verify payment',
          statusCode: status
        }
      },
      { status }
    )
  }
}
