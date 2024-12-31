import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { cn } from '../../../../lib/utils/styles';
import type { Booking } from '../../../../lib/types';

interface Props {
  currentDate: Date;
  bookings: (Booking & { userEmail: string })[];
  onBookingSelect: (booking: Booking & { userEmail: string }) => void;
}

export default function MonthView({ currentDate, bookings, onBookingSelect }: Props) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getBookingsForDay = (date: Date) => {
    return bookings.filter(booking => 
      format(new Date(booking.booking_date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  return (
    <div className="grid grid-cols-7 gap-px bg-gray-200">
      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
        <div key={day} className="bg-gray-50 py-2 text-center text-sm font-medium text-gray-500">
          {day}
        </div>
      ))}
      {days.map((day, dayIdx) => {
        const dayBookings = getBookingsForDay(day);
        return (
          <div
            key={day.toString()}
            className={`bg-white min-h-[120px] p-2 ${
              dayIdx === 0 ? `col-start-${day.getDay() || 7}` : ''
            }`}
          >
            <p className="text-sm font-medium text-gray-500">
              {format(day, 'd')}
            </p>
            <div className="mt-1 space-y-1">
              {dayBookings.map(booking => (
                <button
                  key={booking.id}
                  onClick={() => onBookingSelect(booking)}
                  className={cn(
                    "w-full px-2 py-1 text-xs rounded text-left transition-colors",
                    booking.status === 'cancelled'
                      ? "border border-red-200 bg-red-50/50 text-red-500/75 hover:bg-red-50"
                      : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                  )}
                  title={`${booking.userEmail} - ${booking.channels.name}`}
                >
                  {format(new Date(booking.booking_date), 'HH:mm')} - {booking.channels.name}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}