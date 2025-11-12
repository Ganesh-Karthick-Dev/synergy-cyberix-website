import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { paymentId: string } }
) {
  try {
    const { paymentId } = params

    if (!paymentId) {
      return NextResponse.json(
        { success: false, error: { message: 'Payment ID is required', statusCode: 400 } },
        { status: 400 }
      )
    }

    const cookies = request.cookies
    console.log('[Invoice API] ===== INVOICE DOWNLOAD REQUEST =====')
    console.log('[Invoice API] Payment ID:', paymentId)

    const accessToken = cookies.get('accessToken')?.value

    if (!accessToken) {
      console.log('[Invoice API] ❌ NO ACCESS TOKEN FOUND')
      return NextResponse.json(
        { success: false, error: { message: 'Authentication required', statusCode: 401 } },
        { status: 401 }
      )
    }

    console.log('[Invoice API] ✅ Access token found, forwarding to backend...')

    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4005'

    // Forward the request to backend
    const response = await fetch(`${backendUrl}/api/payments/invoice/${paymentId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Cookie': request.headers.get('cookie') || ''
      }
    })

    console.log('[Invoice API] Backend response status:', response.status)

    if (!response.ok) {
      const errorData = await response.json()
      console.log('[Invoice API] Backend error:', errorData)
      return NextResponse.json(
        { success: false, error: errorData.error || { message: 'Failed to generate invoice', statusCode: response.status } },
        { status: response.status }
      )
    }

    // Get the PDF content
    const pdfBuffer = await response.arrayBuffer()

    console.log('[Invoice API] ✅ Invoice generated successfully, size:', pdfBuffer.byteLength, 'bytes')

    // Return the PDF with proper headers
    const headers = new Headers()
    headers.set('Content-Type', 'application/pdf')
    headers.set('Content-Disposition', `attachment; filename="invoice-${paymentId.slice(-8)}.pdf"`)
    headers.set('Content-Length', pdfBuffer.byteLength.toString())

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers
    })

  } catch (error: any) {
    console.error('[Invoice API] Error downloading invoice:', error)
    return NextResponse.json(
      { success: false, error: { message: error.message || 'Failed to download invoice', statusCode: 500 } },
      { status: 500 }
    )
  }
}
