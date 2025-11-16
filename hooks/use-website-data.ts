import { useQuery } from '@tanstack/react-query'
import { getWebsiteData, type WebsiteData } from '@/lib/api/website'

/**
 * Shared hook for fetching website data (ads and plans)
 * Uses React Query for caching and prevents duplicate API calls
 */
export function useWebsiteData() {
  return useQuery<WebsiteData>({
    queryKey: ['websiteData'], // Shared key - all components use same cache
    queryFn: getWebsiteData,
    staleTime: 5 * 60 * 1000, // 5 minutes - data is fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes - cache for 10 minutes
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnMount: false, // Don't refetch on mount if data exists
    retry: false,
  })
}


