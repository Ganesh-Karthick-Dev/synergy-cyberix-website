import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, error: { message: 'All fields are required', statusCode: 400 } },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: { message: 'Invalid email format', statusCode: 400 } },
        { status: 400 }
      )
    }

    // Default to port 8000 (backend default) or use environment variable
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    const contactUrl = `${backendUrl}/api/contact`

    // Create AbortController for timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

    try {
      const response = await fetch(contactUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, subject, message }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        let errorData = {}
        try {
          errorData = await response.json()
        } catch (parseError) {
          // If response is not JSON, use status text
          errorData = { error: { message: `Server error: ${response.status} ${response.statusText}` } }
        }
        return NextResponse.json(
          { success: false, error: errorData.error || { message: 'Failed to send contact form message', statusCode: response.status } },
          { status: response.status }
        )
      }

      const data = await response.json()
      return NextResponse.json(data, { status: response.status })
    } catch (fetchError: any) {
      clearTimeout(timeoutId)
      
      // Handle timeout or network errors
      if (fetchError.name === 'AbortError' || fetchError.message?.includes('aborted')) {
        console.error('[API/Contact] Request timeout:', contactUrl)
        return NextResponse.json(
          { success: false, error: { message: 'Request timeout. The server is taking too long to respond. Please try again later.', statusCode: 504 } },
          { status: 504 }
        )
      }
      
      // Handle network errors
      if (fetchError.message?.includes('fetch') || fetchError.code === 'ECONNREFUSED' || fetchError.code === 'ENOTFOUND') {
        console.error('[API/Contact] Network error:', fetchError.message, 'URL:', contactUrl)
        return NextResponse.json(
          { success: false, error: { message: 'Unable to connect to server. Please check if the backend server is running.', statusCode: 503 } },
          { status: 503 }
        )
      }
      
      // Re-throw other errors
      throw fetchError
    }

  } catch (error: any) {
    console.error('[API/Contact] Error:', error)
    return NextResponse.json(
      { success: false, error: { message: error.message || 'Internal server error', statusCode: 500 } },
      { status: 500 }
    )
  }
}

