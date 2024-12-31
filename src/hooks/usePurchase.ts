import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { Purchase, Package } from '../lib/types';

export function usePurchase(purchaseId: string | undefined) {
  return useQuery({
    queryKey: ['purchase', purchaseId],
    queryFn: async () => {
      if (!purchaseId) return null;
      
      const { data, error } = await supabase
        .from('purchases')
        .select('*, packages(*)')
        .eq('id', purchaseId)
        .single();
      
      if (error) throw error;
      return data as Purchase & { packages: Package };
    },
    enabled: !!purchaseId
  });
}