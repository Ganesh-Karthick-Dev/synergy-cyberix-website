import { NextRequest, NextResponse } from 'next/server'

/**
 * Debug endpoint to check cookies
 */
export async function GET(request: NextRequest) {
  const cookies = request.cookies

  const cookieInfo = {}
  Object.keys(cookies.getAll()).forEach(cookieName => {
    const cookie = cookies.get(cookieName)
    if (cookieName === 'accessToken') {
      cookieInfo[cookieName] = cookie?.value ? `PRESENT (length: ${cookie.value.length})` : 'MISSING'
    } else {
      cookieInfo[cookieName] = cookie?.value || 'MISSING'
    }
  })

  return NextResponse.json({
    success: true,
    message: 'Cookie debug info',
    data: {
      cookieCount: Object.keys(cookies.getAll()).length,
      cookieNames: Object.keys(cookies.getAll()),
      cookies: cookieInfo,
      rawCookieHeader: request.headers.get('cookie')
    }
  })
}
