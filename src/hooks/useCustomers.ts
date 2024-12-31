import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { Customer } from '../lib/types';

export function useCustomers() {
  return useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customers')
        .select(`
          *,
          user_profiles!inner (
            email,
            created_at
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(customer => ({
        ...customer,
        email: customer.user_profiles.email,
        user_created_at: customer.user_profiles.created_at
      }));
    },
    // Refresh data more frequently
    staleTime: 1000 * 30, // 30 seconds
    retry: 2
  });
}