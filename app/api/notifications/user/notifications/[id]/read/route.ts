import { NextRequest, NextResponse } from 'next/server'
import { createServerApiClient } from '@/lib/api/server-client'

/**
 * Proxy endpoint to mark notification as read
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const apiClient = createServerApiClient(request)
    const response = await apiClient.put(`/api/notifications/user/notifications/${id}/read`)

    return NextResponse.json(response.data, { status: response.status })
  } catch (error: any) {
    console.error('[Notifications API] Error:', error)
    const status = error.response?.status || 500
    const errorData = error.response?.data || {}
    
    return NextResponse.json(
      {
        success: false,
        error: {
          message: errorData.error?.message || error.message || 'Failed to mark notification as read',
          statusCode: status,
        },
      },
      { status }
    )
  }
}



