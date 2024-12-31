import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { Subscription } from '../lib/types';

export function useSubscriptions() {
  return useQuery({
    queryKey: ['admin-subscriptions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subscriptions')
        .select(`
          *,
          user_profiles!inner (
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return data.map(subscription => ({
        ...subscription,
        userEmail: subscription.user_profiles.email
      }));
    },
    // Refresh data more frequently
    staleTime: 1000 * 30, // 30 seconds
    retry: 2
  });
}