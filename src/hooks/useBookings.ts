import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { Booking, Channel, BookingStatus } from '../lib/types';
import { useAuth } from './useAuth';

export function useBookings(status: BookingStatus = 'pending') {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['bookings', user?.id, status],
    queryFn: async () => {
      if (!user) return [];

      // Update completed status for past bookings
      await supabase.rpc('update_completed_bookings');
      
      const query = supabase
        .from('bookings')
        .select('*, channels(*)')
        .eq('user_id', user.id)
        .eq('status', status)
        .order('booking_date', { ascending: status === 'pending' });

      const { data, error } = await query;
      
      if (error) throw error;
      return data as (Booking & { channels: Channel })[];
    },
    enabled: !!user
  });
}

export function useCancelBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bookingId, purchaseId }: { bookingId: string, purchaseId: string }) => {
      const { error } = await supabase.rpc('cancel_booking', { 
        booking_id: bookingId, 
        purchase_id: purchaseId 
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
    }
  });
}