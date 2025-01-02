import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import type { Subscription } from '../lib/types';
import toast from 'react-hot-toast';

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
    enabled: !!user,
  });

  // Subscribe mutation
  const subscribe = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('subscriptions')
        .insert({
          user_id: user.id,
          status: 'active',
          current_period_start: new Date().toISOString(),
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
      toast.success('Successfully subscribed to Prime!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to subscribe');
    }
  });

  // Cancel subscription mutation
  const cancelSubscription = useMutation({
    mutationFn: async () => {
      if (!user || !subscription) throw new Error('No active subscription');

      const { error } = await supabase
        .from('subscriptions')
        .update({ status: 'cancelled' })
        .eq('user_id', user.id)
        .eq('id', subscription.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
      toast.success('Subscription cancelled successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to cancel subscription');
    }
  });

  // Reactivate subscription mutation
  const reactivateSubscription = useMutation({
    mutationFn: async () => {
      if (!user || !subscription) throw new Error('No subscription found');

      const { error } = await supabase
        .from('subscriptions')
        .update({ status: 'active' })
        .eq('user_id', user.id)
        .eq('id', subscription.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
      toast.success('Subscription reactivated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to reactivate subscription');
    }
  });

  // Check if subscription is active
  const isSubscribed = subscription?.status === 'active';

  // Check if subscription period is still valid (even if cancelled)
  const hasValidPeriod =
    subscription && new Date(subscription.current_period_end) > new Date();

  // Check if subscription is cancelled but still valid
  const isCancelledButValid =
    subscription?.status === 'cancelled' && hasValidPeriod;

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
    getMaxBookingDays,
    subscribe,
    cancelSubscription,
    reactivateSubscription
  };
}