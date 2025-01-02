export function generateTimeOptions(interval: number = 30): string[] {
  const times: string[] = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += interval) {
      times.push(
        `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
      );
    }
  }
  return times;
}

export function createDefaultSlot(startTime: string, duration: number): TimeSlot {
  return {
    start: startTime,
    end: calculateEndTime(startTime, duration)
  };
}

export function createDefaultDaySchedule(): DaySchedule {
  return {
    enabled: true,
    slots: [createDefaultSlot('09:30', 90)]
  };
}