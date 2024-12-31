import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { Purchase, Package } from '../lib/types';
import { useAuth } from './useAuth';

export function usePurchases() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['purchases', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('purchases')
        .select(`
          *,
          packages (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as (Purchase & { packages: Package })[];
    },
    enabled: !!user,
    staleTime: 1000 * 60 // 1 minute
  });
}