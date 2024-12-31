import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import type { Subscription } from '../lib/types';
import { addMonths } from 'date-fns';

export function useSubscription() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: subscription, isLoading } = useQuery({
    queryKey: ['subscription', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data as Subscription | null;
    },
    enabled: !!user
  });

  // Check if subscription is active
  const isSubscribed = subscription?.status === 'active';

  // Check if subscription period is still valid (even if cancelled)
  const hasValidPeriod = subscription && 
    new Date(subscription.current_period_end) > new Date();

  // Check if subscription is cancelled but still valid
  const isCancelledButValid = subscription?.status === 'cancelled' && hasValidPeriod;

  // Get max booking days based on subscription status
  const getMaxBookingDays = () => {
    if (!subscription) return 2; // No subscription
    if (!hasValidPeriod) return 2; // Expired subscription
    return 30; // Valid subscription (active or cancelled)
  };

  return {
    subscription,
    isLoading,
    isSubscribed,
    hasValidPeriod,
    isCancelledButValid,
    getMaxBookingDays
  };
}