import { NextRequest, NextResponse } from 'next/server'

/**
 * Unified Website API Route
 * Returns both active ads and active service plans for the website
 */
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4005'
    
    // Fetch both active ads and active plans in parallel
    const [adsResponse, plansResponse] = await Promise.all([
      fetch(`${backendUrl}/api/ads?status=active`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }),
      fetch(`${backendUrl}/api/plans?status=active`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }),
    ])

    // Parse responses
    let ads = []
    let plans = []

    if (adsResponse.ok) {
      const adsData = await adsResponse.json()
      ads = adsData.data || []
    } else {
      console.error('[Website API] Failed to fetch ads:', adsResponse.status)
    }

    if (plansResponse.ok) {
      const plansData = await plansResponse.json()
      plans = plansData.data || []
    } else {
      console.error('[Website API] Failed to fetch plans:', plansResponse.status)
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          ads,
          plans,
        },
        message: 'Website data retrieved successfully',
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, must-revalidate',
        },
      }
    )
  } catch (error: any) {
    console.error('[Website API] Error fetching website data:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          message: error.message || 'Failed to fetch website data',
          statusCode: 500,
        },
        data: {
          ads: [],
          plans: [],
        },
      },
      { status: 500 }
    )
  }
}

