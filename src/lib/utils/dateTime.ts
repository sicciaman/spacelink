export function combineDateTime(date: Date, timeStr: string): Date {
  const [hours, minutes] = timeStr.split(':');
  const combined = new Date(date);
  combined.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
  return combined;
}

export function isSameDateTime(date1: Date, date2: Date): boolean {
  return date1.getTime() === date2.getTime();
}

export function formatDateTime(date: Date): string {
  return date.toISOString();
}