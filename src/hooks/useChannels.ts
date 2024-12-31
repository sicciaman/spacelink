import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { Channel } from '../lib/types';

export function useChannels() {
  return useQuery({
    queryKey: ['channels'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('channels')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as Channel[];
    }
  });
}