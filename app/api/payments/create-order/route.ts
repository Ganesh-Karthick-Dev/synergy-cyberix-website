import { NextRequest, NextResponse } from 'next/server'
import { createServerApiClient } from '@/lib/api/server-client'

/**
 * Create Payment Order API Route
 * Proxies request to backend server
 */
export async function POST(request: NextRequest) {
  try {
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

    const cookies = request.cookies
    const accessToken = cookies.get('accessToken')?.value

    if (!accessToken) {
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

    const apiClient = createServerApiClient(request)
    const response = await apiClient.post(`/api/plans/${planId}/payment-order`, {
      amount,
      currency,
      description
    })

    return NextResponse.json(
      {
        success: true,
        data: response.data.data,
        message: 'Payment order created successfully'
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('[Payment API] Error creating payment order:', error)
    const status = error.response?.status || 500
    const errorData = error.response?.data || {}
    
    return NextResponse.json(
      {
        success: false,
        error: {
          message: errorData.error?.message || error.message || 'Failed to create payment order',
          statusCode: status
        }
      },
      { status }
    )
  }
}
