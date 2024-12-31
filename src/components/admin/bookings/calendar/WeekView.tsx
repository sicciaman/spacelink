import { format, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { cn } from '../../../../lib/utils/styles';
import type { Booking } from '../../../../lib/types';

interface Props {
  currentDate: Date;
  bookings: (Booking & { userEmail: string })[];
  onBookingSelect: (booking: Booking & { userEmail: string }) => void;
}

export default function WeekView({ currentDate, bookings, onBookingSelect }: Props) {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const getBookingsForDay = (date: Date) => {
    return bookings.filter(booking => 
      format(new Date(booking.booking_date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  return (
    <div className="grid grid-cols-7 divide-x divide-gray-200">
      {days.map(day => (
        <div key={day.toString()} className="min-h-[600px]">
          <div className="px-2 py-3 text-center border-b">
            <p className="text-sm font-medium text-gray-900">
              {format(day, 'EEE')}
            </p>
            <p className="text-sm text-gray-500">
              {format(day, 'd')}
            </p>
          </div>
          <div className="divide-y divide-gray-200">
            {getBookingsForDay(day).map(booking => (
              <button
                key={booking.id}
                onClick={() => onBookingSelect(booking)}
                className={cn(
                  "w-full p-2 text-left hover:bg-gray-50 transition-colors",
                  booking.status === 'cancelled' && "border border-red-200 bg-red-50/50"
                )}
              >
                <p className={cn(
                  "text-xs font-medium",
                  booking.status === 'cancelled' ? "text-red-500/75" : "text-gray-900"
                )}>
                  {format(new Date(booking.booking_date), 'HH:mm')}
                </p>
                <p className={cn(
                  "text-xs truncate",
                  booking.status === 'cancelled' ? "text-red-500/60" : "text-gray-500"
                )}>
                  {booking.channels.name}
                </p>
                <p className={cn(
                  "text-xs truncate",
                  booking.status === 'cancelled' ? "text-red-500/60" : "text-gray-500"
                )}>
                  {booking.userEmail}
                </p>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}