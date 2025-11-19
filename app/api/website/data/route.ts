import { NextRequest, NextResponse } from 'next/server'
import { createServerApiClient } from '@/lib/api/server-client'

/**
 * Unified Website API Route
 * Returns both active ads and active service plans for the website
 */
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const apiClient = createServerApiClient(request)
    
    // Fetch both active ads and active plans in parallel
    const [adsResponse, plansResponse] = await Promise.all([
      apiClient.get('/api/ads?status=active').catch((err) => ({ data: { data: [] }, status: err.response?.status || 500 })),
      apiClient.get('/api/plans?status=active').catch((err) => ({ data: { data: [] }, status: err.response?.status || 500 })),
    ])

    // Parse responses
    const ads = adsResponse.data?.data || []
    const plans = plansResponse.data?.data || []

    if (adsResponse.status !== 200) {
      console.error('[Website API] Failed to fetch ads:', adsResponse.status)
    }

    if (plansResponse.status !== 200) {
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

