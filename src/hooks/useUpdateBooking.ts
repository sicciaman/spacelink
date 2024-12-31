import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { Booking } from '../lib/types';

export function useUpdateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      bookingId, 
      updates 
    }: { 
      bookingId: string; 
      updates: Partial<Booking>;
    }) => {
      const { error } = await supabase
        .from('bookings')
        .update({
          product_link: updates.product_link?.trim(),
          coupon: updates.coupon?.trim() || null,
          start_price: updates.start_price,
          discount_price: updates.discount_price
        })
        .eq('id', bookingId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    }
  });
}