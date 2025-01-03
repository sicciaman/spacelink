import { useChannelSettings } from './useChannelSettings';
import { isSlotBlockedBySettings } from '../lib/utils/timeSlots/availability';
import { useOccupiedSlots } from './useOccupiedSlots';

export function useSlotAvailability(channelId: string | null, date: Date | null) {
  const { data: occupiedSlots = [], isLoading: slotsLoading } = useOccupiedSlots(channelId, date);
  const { settings, isLoading: settingsLoading } = useChannelSettings(channelId || '');

  const isSlotAvailable = (time: string): boolean => {
    if (!date || !channelId) return false;

    // Check if slot is occupied
    const slotDateTime = new Date(date);
    const [hours, minutes] = time.split(':').map(Number);
    slotDateTime.setHours(hours, minutes, 0, 0);

    const isOccupied = occupiedSlots.some(slot => 
      slot.getTime() === slotDateTime.getTime()
    );

    if (isOccupied) return false;

    // Check if slot is blocked by channel settings
    const isBlocked = isSlotBlockedBySettings(date, time, settings?.settings);

    return !isBlocked;
  };

  return {
    isSlotAvailable,
    isLoading: slotsLoading || settingsLoading
  };
}