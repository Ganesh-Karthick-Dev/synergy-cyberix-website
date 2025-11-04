/**
 * Ads API Service
 * Handles fetching active ads and tracking impressions/clicks
 */

import apiClient from './client'
import type { ApiResponse } from './types'

export interface Ad {
  id: string
  title: string
  content: string
  link?: string
  isActive: boolean
  priority: 'high' | 'medium' | 'low'
  startDate: string
  endDate: string
  createdAt: string
  updatedAt: string
  clicks: number
  impressions: number
}

/**
 * Get active ads for website display
 * Uses Next.js API route for better caching and security
 */
export const getActiveAds = async (): Promise<Ad[]> => {
  try {
    // Use Next.js API route instead of direct backend call
    const response = await fetch('/api/ads/active', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch active ads: ${response.statusText}`)
    }

    const data: ApiResponse<Ad[]> = await response.json()
    return data.data || []
  } catch (error) {
    console.error('[Ads] Error fetching active ads:', error)
    return []
  }
}

/**
 * Track ad impression (when ad is displayed)
 */
export const trackAdImpression = async (adId: string): Promise<void> => {
  try {
    await apiClient.post(`/api/ads/${adId}/impression`)
  } catch (error) {
    console.error('[Ads] Error tracking impression:', error)
    // Don't throw - impression tracking should be non-blocking
  }
}

/**
 * Track ad click (when user clicks on ad)
 */
export const trackAdClick = async (adId: string): Promise<void> => {
  try {
    await apiClient.post(`/api/ads/${adId}/click`)
  } catch (error) {
    console.error('[Ads] Error tracking click:', error)
    // Don't throw - click tracking should be non-blocking
  }
}

