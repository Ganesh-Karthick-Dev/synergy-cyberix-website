import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getPurchasedPlans, activatePurchasedPlan, type PurchasedPlan } from '@/lib/api/purchased-plans'

const PURCHASED_PLANS_QUERY_KEY = ['purchasedPlans']

/**
 * Hook to fetch user's purchased plans (queue)
 */
export function usePurchasedPlans() {
  return useQuery<PurchasedPlan[]>({
    queryKey: PURCHASED_PLANS_QUERY_KEY,
    queryFn: getPurchasedPlans,
    staleTime: 30 * 1000, // 30 seconds
    refetchOnWindowFocus: true,
  })
}

/**
 * Hook to activate a purchased plan
 */
export function useActivatePurchasedPlan() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: activatePurchasedPlan,
    onSuccess: () => {
      // Invalidate purchased plans and active subscription to refetch
      queryClient.invalidateQueries({ queryKey: PURCHASED_PLANS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: ['activeSubscription'] })
    },
  })
}



