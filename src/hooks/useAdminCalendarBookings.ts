import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';

export function useAdminCalendarBookings(
  startDate: Date,
  endDate: Date,
  channelId: string | null = null
) {
  return useQuery({
    queryKey: ['admin-calendar-bookings', format(startDate, 'yyyy-MM-dd'), format(endDate, 'yyyy-MM-dd'), channelId],
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
        .gte('booking_date', startDate.toISOString())
        .lte('booking_date', endDate.toISOString())
        .order('booking_date');

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