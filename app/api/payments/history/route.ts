import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const cookies = request.cookies
    const accessToken = cookies.get('accessToken')?.value

    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: { message: 'Authentication required', statusCode: 401 } },
        { status: 401 }
      )
    }

    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4005'

    const response = await fetch(`${backendUrl}/api/payments/history`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Cookie': request.headers.get('cookie') || ''
      },
      credentials: 'include'
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        { success: false, error: errorData.error || { message: 'Failed to fetch payment history', statusCode: response.status } },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('[Payment History API] Error:', error)
    return NextResponse.json(
      { success: false, error: { message: 'Internal server error', statusCode: 500 } },
      { status: 500 }
    )
  }
}

