import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export function useOccupiedSlots(channelId: string | null, date: Date | null) {
  return useQuery({
    queryKey: ['occupiedSlots', channelId, date?.toDateString()],
    queryFn: async () => {
      if (!channelId || !date) return [];
      
      // Set time to start of day for date comparison
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      
      // Set time to end of day for date comparison
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);

      const { data, error } = await supabase
        .from('booking_slots')
        .select('booking_date')
        .eq('channel_id', channelId)
        .gte('booking_date', startDate.toISOString())
        .lte('booking_date', endDate.toISOString());

      if (error) throw error;
      return (data || []).map(slot => new Date(slot.booking_date));
    },
    enabled: !!channelId && !!date,
    staleTime: 0, // Disable caching
    cacheTime: 0, // Remove from cache immediately
    refetchInterval: 10000 // Refetch every 10 seconds
  });
}