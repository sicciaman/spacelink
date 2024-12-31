import { supabase } from '../supabase';
import type { Booking } from '../types';

export async function updateBooking(bookingId: string, updates: Partial<Booking>) {
  // First update the booking
  const { data: updatedData, error: updateError } = await supabase
    .from('bookings')
    .update({
      product_link: updates.product_link,
      coupon: updates.coupon || null,
      start_price: updates.start_price,
      discount_price: updates.discount_price
    })
    .eq('id', bookingId)
    .select('*')
    .single();

  if (updateError) throw updateError;
  if (!updatedData) throw new Error('Booking not found');

  // Then fetch the updated booking with channel data
  const { data: bookingWithChannel, error: fetchError } = await supabase
    .from('bookings')
    .select('*, channels(*)')
    .eq('id', bookingId)
    .single();

  if (fetchError) throw fetchError;
  if (!bookingWithChannel) throw new Error('Updated booking not found');

  return bookingWithChannel as Booking;
}