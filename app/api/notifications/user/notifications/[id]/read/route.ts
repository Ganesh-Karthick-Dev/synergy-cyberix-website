import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

/**
 * Proxy endpoint to mark notification as read
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4005'
    const { id } = params
    
    const cookieStore = await cookies()
    const cookieHeader = cookieStore.toString()
    
    const response = await fetch(
      `${backendUrl}/api/notifications/user/notifications/${id}/read`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Cookie: cookieHeader,
        },
        cache: 'no-store',
      }
    )

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status })
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    console.error('[Notifications API] Error:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          message: error.message || 'Failed to mark notification as read',
          statusCode: 500,
        },
      },
      { status: 500 }
    )
  }
}






