import { ChannelSettings } from '../../types';

export function isSlotBlockedBySettings(
  date: Date,
  time: string,
  settings?: ChannelSettings['settings']
): boolean {
  if (!settings?.blocked_dates) return false;

  // Check if the date is blocked
  const blockedDate = settings.blocked_dates.find(block => {
    const blockDate = new Date(block.date);
    return blockDate.toDateString() === date.toDateString();
  });

  if (!blockedDate) return false;

  // If no intervals specified, the entire day is blocked
  if (!blockedDate.intervals.length) return true;

  // Check if the time falls within any blocked interval
  return blockedDate.intervals.some(interval => {
    const [startHour, startMinute] = interval.startTime.split(':').map(Number);
    const [endHour, endMinute] = interval.endTime.split(':').map(Number);
    const [timeHour, timeMinute] = time.split(':').map(Number);

    const timeInMinutes = timeHour * 60 + timeMinute;
    const startInMinutes = startHour * 60 + startMinute;
    const endInMinutes = endHour * 60 + endMinute;

    return timeInMinutes >= startInMinutes && timeInMinutes <= endInMinutes;
  });
}