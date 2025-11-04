/**
 * Website API Service
 * Unified service for fetching website data (ads and plans)
 */

import type { ApiResponse } from './types'
import { Ad } from './ads'

export interface ServicePlan {
  id: string
  name: string
  price: number
  description: string
  features: string[]
  deliveryDays: number
  isPopular: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface WebsiteData {
  ads: Ad[]
  plans: ServicePlan[]
}

/**
 * Get unified website data (active ads and active plans)
 */
export const getWebsiteData = async (): Promise<WebsiteData> => {
  try {
    const response = await fetch('/api/website/data', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch website data: ${response.statusText}`)
    }

    const data: ApiResponse<WebsiteData> = await response.json()
    return data.data || { ads: [], plans: [] }
  } catch (error) {
    console.error('[Website API] Error fetching website data:', error)
    return { ads: [], plans: [] }
  }
}

/**
 * Get active ads only
 */
export const getActiveAds = async (): Promise<Ad[]> => {
  const data = await getWebsiteData()
  return data.ads || []
}

/**
 * Get active service plans only
 */
export const getActivePlans = async (): Promise<ServicePlan[]> => {
  const data = await getWebsiteData()
  return data.plans || []
}

