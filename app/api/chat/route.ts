import { NextRequest, NextResponse } from 'next/server'

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

    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4005'

    const response = await fetch(`${backendUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, conversationHistory }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return NextResponse.json(
        { 
          success: false, 
          error: errorData.error || { message: 'Failed to process chat message', statusCode: response.status } 
        },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })

  } catch (error: any) {
    console.error('[API/Chat] Error:', error)
    return NextResponse.json(
      { success: false, error: { message: error.message || 'Internal server error', statusCode: 500 } },
      { status: 500 }
    )
  }
}

