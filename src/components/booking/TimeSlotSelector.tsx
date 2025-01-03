import { Lock } from 'lucide-react';
import { useEffect } from 'react';
import { useSubscription } from '../../hooks/useSubscription';
import { TIME_SLOTS, isSunday } from '../../lib/constants';
import { cn } from '../../lib/utils/styles';
import { getValidTimeSlots } from '../../lib/utils/timeSlots/validation';
import { useSlotAvailability } from '../../hooks/useSlotAvailability';

interface Props {
  channelId: string | null;
  selectedDate: Date | null;
  selectedTime: string | null;
  onSelect: (time: string) => void;
}

export default function TimeSlotSelector({ 
  channelId, 
  selectedDate, 
  selectedTime, 
  onSelect 
}: Props) {
  const { isSubscribed } = useSubscription();
  const { isSlotAvailable, isLoading } = useSlotAvailability(channelId, selectedDate);

  const baseTimeSlots = selectedDate ? 
    (isSunday(selectedDate) ? TIME_SLOTS.sunday : TIME_SLOTS.weekday) : 
    [];
  const validTimeSlots = selectedDate ? getValidTimeSlots(baseTimeSlots, selectedDate) : [];

  // For non-Prime users, automatically select the first available time slot
  const getFirstAvailableSlot = () => {
    return validTimeSlots.find(time => isSlotAvailable(time));
  };

  // Use useEffect to handle auto-selection for non-Prime users
  useEffect(() => {
    if (!isSubscribed && !selectedTime && selectedDate) {
      const firstAvailable = getFirstAvailableSlot();
      if (firstAvailable) {
        onSelect(firstAvailable);
      }
    }
  }, [isSubscribed, selectedTime, selectedDate, validTimeSlots.join(',')]);

  if (!selectedDate || isLoading) return null;

  const getTimeSlotClasses = (time: string, isAvailable: boolean, isPast: boolean) => {
    const isAutoSelected = !isSubscribed && selectedTime === time;
    const isDisabled = !isSubscribed || !isAvailable || isPast;

    return cn(
      'relative px-4 py-2.5 text-sm rounded-md border transition-all duration-200',
      isDisabled && 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed',
      !isDisabled && selectedTime === time && 'bg-blue-50 border-blue-500 text-blue-700 ring-2 ring-blue-200',
      !isDisabled && selectedTime !== time && 'border-gray-300 text-gray-700 hover:border-gray-400',
      isAutoSelected && 'cursor-default'
    );
  };

  // Check if there are any available slots
  const hasAvailableSlots = validTimeSlots.some(time => isSlotAvailable(time));

  return (
    <div className="mt-6">
      {!hasAvailableSlots && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-800">
          No time slots available for this date. Please select another date.
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {baseTimeSlots.map((time) => {
          const isAvailable = isSlotAvailable(time);
          const isPast = !validTimeSlots.includes(time);
          const isSelectable = isSubscribed && isAvailable && !isPast;
          const isAutoSelected = !isSubscribed && selectedTime === time;

          return (
            <button
              key={time}
              onClick={() => isSelectable && onSelect(time)}
              disabled={!isSelectable || (!isSubscribed && selectedTime !== time)}
              className={getTimeSlotClasses(time, isAvailable, isPast)}
            >
              {time}
              {!isSubscribed && !selectedTime && isAvailable && !isPast && (
                <div className="absolute top-1 right-1">
                  <Lock className="h-3 w-3 text-gray-400" />
                </div>
              )}
              {isAutoSelected && (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-green-50 to-emerald-50 rounded-md border border-emerald-200">
                  <span className="text-sm font-medium text-emerald-700">
                    {time}
                  </span>
                </div>
              )}
              {isAutoSelected && (
                <div className="absolute -top-2 -right-2">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 ring-2 ring-white">
                    <svg className="h-2.5 w-2.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                    </svg>
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}