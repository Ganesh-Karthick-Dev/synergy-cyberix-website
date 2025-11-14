"use client"

import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, FileText, Calendar, CreditCard, Loader2, AlertCircle, CheckCircle2, XCircle } from "lucide-react"
import { format } from "date-fns"
import apiClient from "@/lib/api/client"
import { useState } from "react"

interface PaymentHistoryItem {
  id: string
  invoiceNumber: string
  orderId: string
  amount: number
  currency: string
  status: string
  paymentMethod: string
  transactionId: string
  paidAt: string
  plan: {
    id: string
    name: string
    description: string | null
    price: number
    currency: string
    billingCycle: string
  } | null
  canDownloadInvoice: boolean
}

async function fetchPaymentHistory() {
  const response = await apiClient.get('/api/payments/history')
  return response.data?.data || []
}

export function BillingTab() {
  const [downloadingInvoiceId, setDownloadingInvoiceId] = useState<string | null>(null)

  const { data: paymentHistory, isLoading, error } = useQuery<PaymentHistoryItem[]>({
    queryKey: ['paymentHistory'],
    queryFn: fetchPaymentHistory,
    retry: 1,
    refetchOnWindowFocus: false
  })

  const handleDownloadInvoice = async (paymentId: string) => {
    try {
      setDownloadingInvoiceId(paymentId)
      const response = await fetch(`/api/payments/invoice/${paymentId}`, {
        method: 'GET',
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Failed to download invoice')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `invoice-${paymentId.slice(-8)}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error downloading invoice:', error)
      alert('Failed to download invoice. Please try again.')
    } finally {
      setDownloadingInvoiceId(null)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return (
          <span className="px-2 py-1 bg-green-500/20 border border-green-500/50 rounded text-xs text-green-400 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Completed
          </span>
        )
      case 'PENDING':
        return (
          <span className="px-2 py-1 bg-yellow-500/20 border border-yellow-500/50 rounded text-xs text-yellow-400 font-medium">
            Pending
          </span>
        )
      case 'FAILED':
        return (
          <span className="px-2 py-1 bg-red-500/20 border border-red-500/50 rounded text-xs text-red-400 font-medium flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            Failed
          </span>
        )
      default:
        return (
          <span className="px-2 py-1 bg-gray-500/20 border border-gray-500/50 rounded text-xs text-gray-400 font-medium">
            {status}
          </span>
        )
    }
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy')
    } catch {
      return dateString
    }
  }

  const formatDateTime = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy HH:mm')
    } catch {
      return dateString
    }
  }

  return (
    <Card className="bg-gradient-to-br from-[#1a1a1a] via-[#1f1f1f] to-[#1a1a1a] border border-orange-500/20 shadow-xl shadow-orange-500/5 hover:shadow-orange-500/10 transition-all duration-300 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500/50 via-orange-500 to-orange-500/50"></div>
      <CardHeader className="pb-6 relative z-10">
        <CardTitle className="text-2xl font-bold text-white flex items-center gap-3 mb-2" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '700' }}>
          <div className="w-1.5 h-7 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full shadow-sm shadow-orange-500/50"></div>
          Billing & Invoices
        </CardTitle>
        <CardDescription className="text-gray-400 text-base">
          View your payment history and download invoices
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
            <span className="ml-3 text-gray-400">Loading payment history...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
            <p className="text-red-400 text-lg font-semibold mb-2">Failed to load payment history</p>
            <p className="text-gray-400 text-sm">Please try again later</p>
          </div>
        ) : !paymentHistory || paymentHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <FileText className="w-16 h-16 text-gray-600 mb-4" />
            <p className="text-gray-400 text-lg font-semibold mb-2">No payment history found</p>
            <p className="text-gray-500 text-sm">Your completed payments will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {paymentHistory.map((payment) => (
              <Card
                key={payment.id}
                className="bg-gradient-to-br from-[#2a2a2a] to-[#252525] border border-orange-500/20 hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/10 transition-all duration-300 group"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Left Section: Payment Details */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold text-white" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}>
                              {payment.plan?.name || 'Subscription Plan'}
                            </h3>
                            {getStatusBadge(payment.status)}
                          </div>
                          <p className="text-sm text-gray-400 mb-1">
                            {payment.plan?.description || 'Cybersecurity Service Plan'}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-[#1a1a1a]/50 border border-orange-500/10 group/item hover:border-orange-500/30 transition-all">
                          <div className="p-2 rounded-lg bg-orange-500/10 group-hover/item:bg-orange-500/20 transition-colors">
                            <FileText className="w-4 h-4 text-orange-400" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-0.5">Invoice</p>
                            <p className="text-sm font-semibold text-white">{payment.invoiceNumber}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-[#1a1a1a]/50 border border-orange-500/10 group/item hover:border-orange-500/30 transition-all">
                          <div className="p-2 rounded-lg bg-orange-500/10 group-hover/item:bg-orange-500/20 transition-colors">
                            <CreditCard className="w-4 h-4 text-orange-400" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-0.5">Method</p>
                            <p className="text-sm font-semibold text-white capitalize">{payment.paymentMethod}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-[#1a1a1a]/50 border border-orange-500/10 group/item hover:border-orange-500/30 transition-all">
                          <div className="p-2 rounded-lg bg-orange-500/10 group-hover/item:bg-orange-500/20 transition-colors">
                            <Calendar className="w-4 h-4 text-orange-400" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-0.5">Date</p>
                            <p className="text-sm font-semibold text-white">{formatDate(payment.paidAt)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-[#1a1a1a]/50 border border-orange-500/10 group/item hover:border-orange-500/30 transition-all">
                          <div className="p-2 rounded-lg bg-orange-500/10 group-hover/item:bg-orange-500/20 transition-colors">
                            <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-500 mb-0.5">Transaction ID</p>
                            <p className="text-sm font-semibold text-white font-mono truncate">{payment.transactionId}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Section: Amount and Download */}
                    <div className="flex flex-col items-end gap-3 lg:min-w-[200px]">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-orange-500 mb-1" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '700' }}>
                          {formatCurrency(payment.amount, payment.currency)}
                        </p>
                        {payment.plan?.billingCycle && (
                          <p className="text-xs text-gray-400">
                            {payment.plan.billingCycle === 'MONTHLY' ? 'Monthly' : 
                             payment.plan.billingCycle === 'YEARLY' ? 'Yearly' : 
                             payment.plan.billingCycle}
                          </p>
                        )}
                      </div>
                      <Button
                        onClick={() => handleDownloadInvoice(payment.id)}
                        disabled={downloadingInvoiceId === payment.id || !payment.canDownloadInvoice}
                        className="w-full lg:w-auto bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white cursor-pointer shadow-lg hover:shadow-orange-500/50 transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}
                      >
                        {downloadingInvoiceId === payment.id ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Downloading...
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4 mr-2" />
                            Download Invoice
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

