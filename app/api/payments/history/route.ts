import { NextRequest, NextResponse } from 'next/server'
import { createServerApiClient } from '@/lib/api/server-client'

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

    const apiClient = createServerApiClient(request)
    const response = await apiClient.get('/api/payments/history')

    return NextResponse.json(response.data)
  } catch (error: any) {
    console.error('[Payment History API] Error:', error)
    const status = error.response?.status || 500
    const errorData = error.response?.data || {}
    
    return NextResponse.json(
      { 
        success: false, 
        error: errorData.error || { message: 'Internal server error', statusCode: status } 
      },
      { status }
    )
  }
}

