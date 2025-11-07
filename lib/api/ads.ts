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

