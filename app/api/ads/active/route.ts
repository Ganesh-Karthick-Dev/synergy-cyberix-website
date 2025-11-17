import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4005'
    
    // Fetch active ads from backend
    const response = await fetch(`${backendUrl}/api/ads?status=active`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Always fetch fresh data
    })

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`)
    }

    const data = await response.json()

    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, must-revalidate',
      },
    })
  } catch (error: any) {
    console.error('[Ads API] Error fetching active ads:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          message: error.message || 'Failed to fetch active ads',
          statusCode: 500,
        },
        data: [],
      },
      { status: 500 }
    )
  }
}


