import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// Use the same backend URL as other API routes
const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4005'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('accessToken')?.value

    if (!token) {
      return NextResponse.json(
        { success: false, error: { message: 'Unauthorized', statusCode: 401 } },
        { status: 401 }
      )
    }

    const response = await fetch(`${backendUrl}/api/plans/purchased`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error fetching purchased plans:', error)
    return NextResponse.json(
      { success: false, error: { message: error.message || 'Failed to fetch purchased plans', statusCode: 500 } },
      { status: 500 }
    )
  }
}

