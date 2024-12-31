import { addHours, isBefore, isAfter, parseISO } from 'date-fns';

export function isTimeSlotValid(date: Date, timeStr: string): boolean {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const slotTime = new Date(date);
  slotTime.setHours(hours, minutes, 0, 0);

  const now = new Date();
  const minBookingTime = addHours(now, 1); // Must book at least 1 hour in advance

  return isAfter(slotTime, minBookingTime);
}

export function getValidTimeSlots(slots: string[], selectedDate: Date): string[] {
  return slots.filter(slot => isTimeSlotValid(selectedDate, slot));
}