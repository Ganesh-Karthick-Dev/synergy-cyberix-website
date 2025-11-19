import { NextRequest, NextResponse } from 'next/server'
import { createServerApiClient } from '@/lib/api/server-client'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * Chat API Route
 * Proxies request to backend server
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, conversationHistory = [] } = body

    // Validate required fields
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { success: false, error: { message: 'Message is required and must be a string', statusCode: 400 } },
        { status: 400 }
      )
    }

    const apiClient = createServerApiClient(request)
    const response = await apiClient.post('/api/chat', {
      message,
      conversationHistory,
    })

    return NextResponse.json(response.data, { status: response.status })

  } catch (error: any) {
    console.error('[API/Chat] Error:', error)
    const status = error.response?.status || 500
    const errorData = error.response?.data || {}
    
      return NextResponse.json(
        { 
          success: false, 
        error: errorData.error || { message: error.message || 'Internal server error', statusCode: status } 
      },
      { status }
    )
  }
}

