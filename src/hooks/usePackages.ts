import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { Package } from '../lib/types';

export function usePackages(channelId: string | null) {
  return useQuery({
    queryKey: ['packages', channelId],
    queryFn: async () => {
      if (!channelId) return [];
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .eq('channel_id', channelId)
        .order('post_count');
      
      if (error) throw error;
      return data as Package[];
    },
    enabled: !!channelId
  });
}