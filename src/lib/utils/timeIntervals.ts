export function validateTimeInterval(startTime: string, endTime: string): string | null {
  if (!startTime || !endTime) {
    return 'Both start and end time are required';
  }

  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);
  
  const startMinutes = startHour * 60 + startMinute;
  const endMinutes = endHour * 60 + endMinute;

  if (startMinutes >= endMinutes) {
    return 'End time must be after start time';
  }

  return null;
}

export function checkIntervalsOverlap(
  intervals: { startTime: string; endTime: string }[]
): { [key: number]: string | null } {
  const errors: { [key: number]: string | null } = {};

  intervals.forEach((interval, index) => {
    // Skip empty intervals
    if (!interval.startTime || !interval.endTime) {
      return;
    }

    // Validate current interval
    const error = validateTimeInterval(interval.startTime, interval.endTime);
    if (error) {
      errors[index] = error;
      return;
    }

    // Check overlap with other intervals
    const [currentStartHour, currentStartMinute] = interval.startTime.split(':').map(Number);
    const [currentEndHour, currentEndMinute] = interval.endTime.split(':').map(Number);
    const currentStart = currentStartHour * 60 + currentStartMinute;
    const currentEnd = currentEndHour * 60 + currentEndMinute;

    intervals.forEach((otherInterval, otherIndex) => {
      if (index !== otherIndex && otherInterval.startTime && otherInterval.endTime) {
        const [otherStartHour, otherStartMinute] = otherInterval.startTime.split(':').map(Number);
        const [otherEndHour, otherEndMinute] = otherInterval.endTime.split(':').map(Number);
        const otherStart = otherStartHour * 60 + otherStartMinute;
        const otherEnd = otherEndHour * 60 + otherEndMinute;

        const overlaps = (
          (currentStart >= otherStart && currentStart < otherEnd) ||
          (currentEnd > otherStart && currentEnd <= otherEnd) ||
          (currentStart <= otherStart && currentEnd >= otherEnd)
        );

        if (overlaps) {
          errors[index] = 'Time intervals cannot overlap';
        }
      }
    });
  });

  return errors;
}