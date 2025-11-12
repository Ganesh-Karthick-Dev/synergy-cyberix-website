import { NextRequest, NextResponse } from 'next/server'
import Cookies from 'js-cookie'

/**
 * Create Payment Order API Route
 * Proxies request to backend server
 */
export async function POST(request: NextRequest) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4005'

    // Get request body
    const body = await request.json()
    const { planId, amount, currency, description } = body

    // Validate required fields
    if (!planId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Plan ID is required',
            statusCode: 400
          }
        },
        { status: 400 }
      )
    }

    // Get auth token from cookies (server-side) - detailed logging
    const cookies = request.cookies
    console.log('[Payment API] ===== PAYMENT AUTH CHECK =====')
    console.log('[Payment API] All cookies received:', Object.keys(cookies.getAll()).length, 'cookies')
    console.log('[Payment API] Cookie names:', Object.keys(cookies.getAll()))

    // Log all cookies with their values (safely)
    Object.keys(cookies.getAll()).forEach(cookieName => {
      const cookie = cookies.get(cookieName)
      if (cookieName === 'accessToken') {
        console.log(`[Payment API] ${cookieName}: ${cookie?.value ? 'PRESENT (length: ' + cookie.value.length + ')' : 'MISSING'}`)
      } else {
        console.log(`[Payment API] ${cookieName}: ${cookie?.value || 'MISSING'}`)
      }
    })

    console.log('[Payment API] accessToken cookie exists:', cookies.get('accessToken') ? 'YES' : 'NO')
    console.log('[Payment API] accessToken value length:', cookies.get('accessToken')?.value?.length || 0)

    const accessToken = cookies.get('accessToken')?.value

    if (!accessToken) {
      console.log('[Payment API] ❌ NO ACCESS TOKEN FOUND')
      console.log('[Payment API] Available cookies:', Object.keys(cookies.getAll()))
      console.log('[Payment API] Raw cookie header:', request.headers.get('cookie'))
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Authentication required - no access token found',
            statusCode: 401
          }
        },
        { status: 401 }
      )
    }

    console.log('[Payment API] ✅ Access token found, length:', accessToken.length)
    console.log('[Payment API] Token preview:', accessToken.substring(0, 20) + '...')

    // Forward request to backend
    console.log('[Payment API] ===== FORWARDING TO BACKEND =====')
    console.log('[Payment API] Backend URL:', backendUrl)
    console.log('[Payment API] Full URL:', `${backendUrl}/api/plans/${planId}/payment-order`)
    console.log('[Payment API] Authorization header:', `Bearer ${accessToken.substring(0, 20)}...`)
    console.log('[Payment API] Cookie header present:', !!request.headers.get('cookie'))

    const response = await fetch(`${backendUrl}/api/plans/${planId}/payment-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'Cookie': request.headers.get('cookie') || ''
      },
      body: JSON.stringify({
        amount,
        currency,
        description
      })
    })

    console.log('[Payment API] Backend response status:', response.status)
    console.log('[Payment API] Backend response ok:', response.ok)

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        {
          success: false,
          error: {
            message: errorData.error?.message || 'Failed to create payment order',
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
        message: 'Payment order created successfully'
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('[Payment API] Error creating payment order:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          message: error.message || 'Failed to create payment order',
          statusCode: 500
        }
      },
      { status: 500 }
    )
  }
}
