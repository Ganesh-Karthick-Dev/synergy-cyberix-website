import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4005'
    
    // Get auth token from cookies (server-side) - detailed logging
    const cookies = request.cookies
    console.log('[Subscription API] ===== SUBSCRIPTION AUTH CHECK =====')
    console.log('[Subscription API] All cookies received:', Object.keys(cookies.getAll()).length, 'cookies')
    console.log('[Subscription API] Cookie names:', Object.keys(cookies.getAll()))

    // Log all cookies with their values (safely)
    Object.keys(cookies.getAll()).forEach(cookieName => {
      const cookie = cookies.get(cookieName)
      if (cookieName === 'accessToken') {
        console.log(`[Subscription API] ${cookieName}: ${cookie?.value ? 'PRESENT (length: ' + cookie.value.length + ')' : 'MISSING'}`)
      } else {
        console.log(`[Subscription API] ${cookieName}: ${cookie?.value ? 'PRESENT' : 'MISSING'}`)
      }
    })

    console.log('[Subscription API] accessToken cookie exists:', cookies.get('accessToken') ? 'YES' : 'NO')
    console.log('[Subscription API] accessToken value length:', cookies.get('accessToken')?.value?.length || 0)
    console.log('[Subscription API] Raw cookie header:', request.headers.get('cookie')?.substring(0, 200) || 'MISSING')

    const accessToken = cookies.get('accessToken')?.value

    if (!accessToken) {
      console.log('[Subscription API] ❌ NO ACCESS TOKEN FOUND')
      console.log('[Subscription API] Available cookies:', Object.keys(cookies.getAll()))
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Authentication required - no access token found',
            statusCode: 401
          }
        },
        { status: 401 }
      )
    }

    console.log('[Subscription API] ✅ Access token found, fetching subscription...')

    // Forward all cookies to backend
    const cookieHeader = request.headers.get('cookie') || ''
    console.log('[Subscription API] Forwarding cookies to backend, cookie header length:', cookieHeader.length)

    const response = await fetch(`${backendUrl}/api/plans/subscription/active`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'Cookie': cookieHeader // Forward all cookies
      },
      credentials: 'include',
      cache: 'no-store'
    })
    
    console.log('[Subscription API] Backend response status:', response.status)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('[Subscription API] Backend error:', errorData)
      return NextResponse.json(
        {
          success: false,
          error: {
            message: errorData.error?.message || 'Failed to fetch subscription',
            statusCode: response.status
          }
        },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log('[Subscription API] ✅ Subscription fetched:', data)

    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, must-revalidate'
      }
    })
  } catch (error: any) {
    console.error('[Subscription API] Error:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          message: error.message || 'Failed to fetch subscription',
          statusCode: 500
        }
      },
      { status: 500 }
    )
  }
}

