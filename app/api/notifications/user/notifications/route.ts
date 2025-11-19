import { NextRequest, NextResponse } from 'next/server'
import { createServerApiClient } from '@/lib/api/server-client'

/**
 * Proxy endpoint for user notifications
 */
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const queryString = searchParams.toString()
    const url = `/api/notifications/user/notifications${queryString ? `?${queryString}` : ''}`
    
    const apiClient = createServerApiClient(request)
    const response = await apiClient.get(url)

    return NextResponse.json(response.data, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, must-revalidate',
      },
    })
  } catch (error: any) {
    console.error('[Notifications API] Error:', error)
    const status = error.response?.status || 500
    const errorData = error.response?.data || {}
    
    return NextResponse.json(
      {
        success: false,
        error: {
          message: errorData.error?.message || error.message || 'Failed to fetch notifications',
          statusCode: status,
        },
      },
      { status }
    )
  }
}



