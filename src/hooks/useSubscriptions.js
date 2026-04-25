import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subscriptionsAPI } from '@/api/subscriptions';
import { toast } from 'sonner';

export function usePlans() {
  return useQuery({
    queryKey: ['subscription-plans'],
    queryFn: () => subscriptionsAPI.getPlans(),
  });
}

export function useCurrentSubscription() {
  return useQuery({
    queryKey: ['current-subscription'],
    queryFn: () => subscriptionsAPI.getCurrentSubscription(),
  });
}

export function useCancelSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => subscriptionsAPI.cancelSubscription(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['current-subscription'] });
      toast.success('Subscription cancelled successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to cancel subscription');
    },
  });
}