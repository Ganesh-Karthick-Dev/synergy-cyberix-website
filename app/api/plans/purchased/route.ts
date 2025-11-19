import { NextRequest, NextResponse } from 'next/server'
import { createServerApiClient } from '@/lib/api/server-client'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const cookies = request.cookies
    const token = cookies.get('accessToken')?.value

    if (!token) {
      return NextResponse.json(
        { success: false, error: { message: 'Unauthorized', statusCode: 401 } },
        { status: 401 }
      )
    }

    const apiClient = createServerApiClient(request)
    const response = await apiClient.get('/api/plans/purchased')

    return NextResponse.json(response.data, { status: response.status })
  } catch (error: any) {
    console.error('Error fetching purchased plans:', error)
    const status = error.response?.status || 500
    const errorData = error.response?.data || {}
    
    return NextResponse.json(
      { 
        success: false, 
        error: errorData.error || { message: error.message || 'Failed to fetch purchased plans', statusCode: status } 
      },
      { status }
    )
  }
}

