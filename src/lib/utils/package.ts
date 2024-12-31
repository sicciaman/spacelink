import { addMonths, differenceInDays, isBefore } from 'date-fns';
import type { Purchase, Booking } from '../types';

export function getExpirationDate(purchase: Purchase): Date {
  return addMonths(new Date(purchase.created_at), 2);
}

export function isPackageExpired(purchase: Purchase): boolean {
  return isBefore(getExpirationDate(purchase), new Date());
}

export function getDaysUntilExpiration(purchase: Purchase): number {
  return differenceInDays(getExpirationDate(purchase), new Date());
}

export function sortPackagesByDate(packages: Purchase[]): Purchase[] {
  return [...packages].sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export function isPackageUsed(purchase: Purchase, bookings: Booking[]): boolean {
  if (purchase.posts_remaining > 0) return false;
  
  const packageBookings = bookings.filter(b => b.purchase_id === purchase.id);
  return packageBookings.every(b => b.status === 'completed' || b.status === 'cancelled');
}