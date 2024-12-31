import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { BookingStatus } from '../lib/types';

export function useAdminBookings(status: BookingStatus = 'pending', channelId: string | null = null) {
  return useQuery({
    queryKey: ['admin-bookings', status, channelId],
    queryFn: async () => {
      let query = supabase
        .from('bookings')
        .select(`
          *,
          channels (*),
          user_profiles!inner (
            email
          )
        `)
        .eq('status', status)
        .order('booking_date', { ascending: status === 'pending' });

      if (channelId) {
        query = query.eq('channel_id', channelId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data.map(booking => ({
        ...booking,
        userEmail: booking.user_profiles.email
      }));
    },
    // Refresh data every 10 seconds
    refetchInterval: 10000,
    // Disable caching to always get fresh data
    staleTime: 0,
    // Keep previous data while fetching
    keepPreviousData: true
  });
}