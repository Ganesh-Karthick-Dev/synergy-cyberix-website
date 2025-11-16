import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// Use the same backend URL as other API routes
const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4005'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('accessToken')?.value

    if (!token) {
      return NextResponse.json(
        { success: false, error: { message: 'Unauthorized', statusCode: 401 } },
        { status: 401 }
      )
    }

    const { id } = params

    const response = await fetch(`${backendUrl}/api/plans/purchased/${id}/activate`, {
      method: 'POST',
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
    console.error('Error activating purchased plan:', error)
    return NextResponse.json(
      { success: false, error: { message: error.message || 'Failed to activate purchased plan', statusCode: 500 } },
      { status: 500 }
    )
  }
}

