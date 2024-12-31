import { BookingStatus } from '../types';
import { twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';

export const statusColors: Record<BookingStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}