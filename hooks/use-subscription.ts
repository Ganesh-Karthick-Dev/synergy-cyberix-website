import { useQuery } from '@tanstack/react-query'
import Cookies from 'js-cookie'

async function fetchActiveSubscription() {
  try {
    const response = await fetch('/api/subscription/active', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      cache: 'no-store'
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data.data || null
  } catch (error) {
    return null
  }
}

/**
 * Shared hook for fetching active subscription
 * Uses React Query for caching and prevents duplicate API calls
 */
export function useActiveSubscription() {
  const isAuthenticated = Cookies.get('isAuthenticated') === 'true' || !!Cookies.get('accessToken')

  return useQuery({
    queryKey: ['activeSubscription'], // Shared key - all components use same cache
    queryFn: fetchActiveSubscription,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes - data is fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes - cache for 10 minutes
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnMount: false, // Don't refetch on mount if data exists
    retry: false,
  })
}


