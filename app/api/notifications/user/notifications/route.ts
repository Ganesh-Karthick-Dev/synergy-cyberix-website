import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

/**
 * Proxy endpoint for user notifications
 */
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4005'
    const searchParams = request.nextUrl.searchParams
    
    // Forward query parameters
    const queryString = searchParams.toString()
    const url = `${backendUrl}/api/notifications/user/notifications${queryString ? `?${queryString}` : ''}`
    
    // Get cookies to forward authentication
    const cookieStore = await cookies()
    const cookieHeader = cookieStore.toString()
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieHeader,
      },
      cache: 'no-store',
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status })
    }

    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, must-revalidate',
      },
    })
  } catch (error: any) {
    console.error('[Notifications API] Error:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          message: error.message || 'Failed to fetch notifications',
          statusCode: 500,
        },
      },
      { status: 500 }
    )
  }
}






