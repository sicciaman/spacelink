import { format, isToday, isSameDay, addDays, startOfWeek, endOfWeek } from 'date-fns';
import { cn } from '../../lib/utils/styles';

interface CalendarProps {
  selectedDate: Date | null;
  onSelect: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
}

export default function Calendar({ selectedDate, onSelect, minDate = new Date(), maxDate = addDays(new Date(), 60) }: CalendarProps) {
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const today = new Date();

  // Generate calendar days
  const generateDays = () => {
    const days = [];
    let currentDate = startOfWeek(today, { weekStartsOn: 1 });
    const end = endOfWeek(maxDate, { weekStartsOn: 1 });

    while (currentDate <= end) {
      days.push(currentDate);
      currentDate = addDays(currentDate, 1);
    }

    return days;
  };

  const days = generateDays();

  const isDateDisabled = (date: Date) => {
    return date < minDate || date > maxDate;
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
          const disabled = isDateDisabled(day);

          return (
            <button
              key={index}
              onClick={() => !disabled && onSelect(day)}
              disabled={disabled}
              className={cn(
                "h-10 rounded-lg text-sm font-medium",
                isSelected && "bg-blue-600 text-white hover:bg-blue-700",
                !isSelected && !disabled && "hover:bg-gray-100",
                isToday(day) && !isSelected && "text-blue-600 font-bold",
                disabled && "text-gray-300 cursor-not-allowed",
                "transition-colors"
              )}
            >
              {format(day, 'd')}
            </button>
          );
        })}
      </div>
    </div>
  );
}