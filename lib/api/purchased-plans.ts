/**
 * Purchased Plans API Service
 */

import type { ApiResponse } from './types'

export interface PurchasedPlan {
  id: string
  planId: string
  plan: {
    id: string
    name: string
    description: string | null
    price: number
    billingCycle: string
    features: any
  }
  status: string
  scheduledActivationDate?: string | null
  createdAt: string
  paymentOrder: {
    id: string
    amount: number
    currency: string
    status: string
    createdAt: string
  }
}

/**
 * Get user's purchased plans (queue)
 * Uses fetch to go through Next.js API route
 */
export const getPurchasedPlans = async (): Promise<PurchasedPlan[]> => {
  try {
    const response = await fetch('/api/plans/purchased', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch purchased plans: ${response.status}`)
    }

    const data: ApiResponse<PurchasedPlan[]> = await response.json()
    return data.data || []
  } catch (error) {
    console.error('Error fetching purchased plans:', error)
    throw error
  }
}

/**
 * Activate a purchased plan
 * Uses fetch to go through Next.js API route
 */
export const activatePurchasedPlan = async (purchasedPlanId: string): Promise<any> => {
  try {
    const response = await fetch(`/api/plans/purchased/${purchasedPlanId}/activate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      cache: 'no-store',
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error?.message || `Failed to activate plan: ${response.status}`)
    }

    const data: ApiResponse<any> = await response.json()
    return data.data
  } catch (error) {
    console.error('Error activating purchased plan:', error)
    throw error
  }
}

