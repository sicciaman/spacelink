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