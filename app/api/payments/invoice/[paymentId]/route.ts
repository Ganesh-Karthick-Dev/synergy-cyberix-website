import { NextRequest, NextResponse } from 'next/server'
import { createServerApiClient } from '@/lib/api/server-client'

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
    const accessToken = cookies.get('accessToken')?.value

    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: { message: 'Authentication required', statusCode: 401 } },
        { status: 401 }
      )
    }

    const apiClient = createServerApiClient(request)
    const response = await apiClient.get(`/api/payments/invoice/${paymentId}`, {
      responseType: 'arraybuffer'
    })

    // Get the PDF content
    const pdfBuffer = Buffer.from(response.data)

    // Return the PDF with proper headers
    const headers = new Headers()
    headers.set('Content-Type', 'application/pdf')
    headers.set('Content-Disposition', `attachment; filename="invoice-${paymentId.slice(-8)}.pdf"`)
    headers.set('Content-Length', pdfBuffer.length.toString())

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers
    })

  } catch (error: any) {
    console.error('[Invoice API] Error downloading invoice:', error)
    const status = error.response?.status || 500
    const errorData = error.response?.data || {}
    
    // Try to parse error if it's JSON
    let errorMessage = 'Failed to download invoice'
    if (error.response?.data && typeof error.response.data === 'string') {
      try {
        const parsed = JSON.parse(error.response.data)
        errorMessage = parsed.error?.message || errorMessage
      } catch {
        // If not JSON, use default message
      }
    } else if (errorData.error?.message) {
      errorMessage = errorData.error.message
    }
    
    return NextResponse.json(
      { success: false, error: { message: errorMessage, statusCode: status } },
      { status }
    )
  }
}
