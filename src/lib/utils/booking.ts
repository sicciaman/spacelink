import type { Booking } from '../types';

export function canCancelBooking(bookingDate: string): boolean {
  const now = new Date();
  const booking = new Date(bookingDate);
  const hoursUntilBooking = (booking.getTime() - now.getTime()) / (1000 * 60 * 60);
  return hoursUntilBooking >= 24;
}

export function validateBookingUpdate(updates: Partial<Booking>): boolean {
  return !!(
    updates.product_link?.trim() &&
    updates.start_price &&
    updates.start_price > 0 &&
    updates.discount_price &&
    updates.discount_price > 0 &&
    updates.discount_price < updates.start_price
  );
}

export function formatBookingUpdate(updates: Partial<Booking>) {
  return {
    product_link: updates.product_link?.trim(),
    coupon: updates.coupon?.trim() || null,
    start_price: Number(updates.start_price),
    discount_price: Number(updates.discount_price),
  };
}