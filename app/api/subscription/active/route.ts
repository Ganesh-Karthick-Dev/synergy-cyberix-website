import { NextRequest, NextResponse } from 'next/server'
import { createServerApiClient } from '@/lib/api/server-client'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
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
    const response = await apiClient.get('/api/plans/subscription/active')

    return NextResponse.json(response.data, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, must-revalidate'
      }
    })
  } catch (error: any) {
    console.error('[Subscription API] Error:', error)
    const status = error.response?.status || 500
    const errorData = error.response?.data || {}
    
    return NextResponse.json(
      {
        success: false,
        error: {
          message: errorData.error?.message || error.message || 'Failed to fetch subscription',
          statusCode: status
        }
      },
      { status }
    )
  }
}

