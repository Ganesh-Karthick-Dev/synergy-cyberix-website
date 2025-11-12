import { NextRequest, NextResponse } from 'next/server'

/**
 * Verify Payment API Route
 * Proxies request to backend server
 */
export async function POST(request: NextRequest) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4005'

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

    // Get auth token from cookies - detailed logging
    const cookies = request.cookies
    console.log('[Payment Verify API] ===== VERIFY AUTH CHECK =====')
    console.log('[Payment Verify API] All cookies received:', Object.keys(cookies.getAll()).length, 'cookies')
    console.log('[Payment Verify API] Cookie names:', Object.keys(cookies.getAll()))
    console.log('[Payment Verify API] accessToken cookie exists:', cookies.get('accessToken') ? 'YES' : 'NO')

    const accessToken = cookies.get('accessToken')?.value

    if (!accessToken) {
      console.log('[Payment Verify API] ❌ NO ACCESS TOKEN FOUND')
      console.log('[Payment Verify API] Available cookies:', Object.keys(cookies.getAll()))
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

    console.log('[Payment Verify API] ✅ Access token found, length:', accessToken.length)

    // Forward request to backend
    const response = await fetch(`${backendUrl}/api/payments/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'Cookie': request.headers.get('cookie') || ''
      },
      body: JSON.stringify({
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        {
          success: false,
          error: {
            message: errorData.error?.message || 'Payment verification failed',
            statusCode: response.status
          }
        },
        { status: response.status }
      )
    }

    const data = await response.json()

    return NextResponse.json(
      {
        success: true,
        data: data.data,
        message: 'Payment verified successfully'
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('[Payment API] Error verifying payment:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          message: error.message || 'Failed to verify payment',
          statusCode: 500
        }
      },
      { status: 500 }
    )
  }
}
