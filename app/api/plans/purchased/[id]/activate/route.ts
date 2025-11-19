import { NextRequest, NextResponse } from 'next/server'
import { createServerApiClient } from '@/lib/api/server-client'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookies = request.cookies
    const token = cookies.get('accessToken')?.value

    if (!token) {
      return NextResponse.json(
        { success: false, error: { message: 'Unauthorized', statusCode: 401 } },
        { status: 401 }
      )
    }

    const { id } = params
    const apiClient = createServerApiClient(request)
    const response = await apiClient.post(`/api/plans/purchased/${id}/activate`)

    return NextResponse.json(response.data, { status: response.status })
  } catch (error: any) {
    console.error('Error activating purchased plan:', error)
    const status = error.response?.status || 500
    const errorData = error.response?.data || {}
    
    return NextResponse.json(
      { 
        success: false, 
        error: errorData.error || { message: error.message || 'Failed to activate purchased plan', statusCode: status } 
      },
      { status }
    )
  }
}

