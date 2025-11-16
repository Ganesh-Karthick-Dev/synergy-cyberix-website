import { useQuery } from '@tanstack/react-query'
import apiClient from '@/lib/api/client'
import Cookies from 'js-cookie'

async function fetchUserProfile() {
  try {
    const response = await apiClient.get('/api/auth/profile')
    return response.data?.data || null
  } catch (error) {
    return null
  }
}

/**
 * Shared hook for fetching user profile
 * Uses React Query for caching and prevents duplicate API calls
 */
export function useUserProfile() {
  const isAuthenticated = Cookies.get('isAuthenticated') === 'true' || !!Cookies.get('accessToken')

  return useQuery({
    queryKey: ['userProfile'], // Shared key - all components use same cache
    queryFn: fetchUserProfile,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes - data is fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes - cache for 10 minutes
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnMount: false, // Don't refetch on mount if data exists
    retry: false,
  })
}


