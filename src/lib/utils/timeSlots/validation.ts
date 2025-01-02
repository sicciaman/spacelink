import { TimeSlot, TimeSlotError } from './types';
import { timeToMinutes, getDuration } from './calculations';

export function validateTimeSlot(
  slot: TimeSlot,
  minDuration: number,
  existingSlots: TimeSlot[]
): TimeSlotError | null {
  // Check minimum duration
  const duration = getDuration(slot.start, slot.end);
  if (duration < minDuration) {
    return {
      type: 'duration',
      message: `Time slot must be at least ${minDuration} minutes`
    };
  }

  // Check time order
  if (timeToMinutes(slot.start) >= timeToMinutes(slot.end)) {
    return {
      type: 'order',
      message: 'End time must be after start time'
    };
  }

  // Check for overlaps
  const slotStart = timeToMinutes(slot.start);
  const slotEnd = timeToMinutes(slot.end);

  for (const existing of existingSlots) {
    const existingStart = timeToMinutes(existing.start);
    const existingEnd = timeToMinutes(existing.end);

    if (
      (slotStart >= existingStart && slotStart < existingEnd) ||
      (slotEnd > existingStart && slotEnd <= existingEnd) ||
      (slotStart <= existingStart && slotEnd >= existingEnd)
    ) {
      return {
        type: 'overlap',
        message: 'Time slot overlaps with an existing slot'
      };
    }
  }

  return null;
}

export function getValidTimeSlots(slots: string[], selectedDate: Date): string[] {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const selectedDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());

  // If selected date is today, filter out past times
  if (selectedDay.getTime() === today.getTime()) {
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    return slots.filter(slot => {
      const [hours, minutes] = slot.split(':').map(Number);
      if (hours > currentHour) return true;
      if (hours === currentHour) return minutes > currentMinute + 60; // Add 1 hour buffer
      return false;
    });
  }

  return slots;
}