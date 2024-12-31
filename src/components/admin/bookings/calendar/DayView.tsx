import { format } from 'date-fns';
import { cn } from '../../../../lib/utils/styles';
import type { Booking } from '../../../../lib/types';

interface Props {
  currentDate: Date;
  bookings: (Booking & { userEmail: string })[];
  onBookingSelect: (booking: Booking & { userEmail: string }) => void;
}

export default function DayView({ currentDate, bookings, onBookingSelect }: Props) {
  const dayBookings = bookings.filter(booking => 
    format(new Date(booking.booking_date), 'yyyy-MM-dd') === format(currentDate, 'yyyy-MM-dd')
  );

  return (
    <div className="min-h-[600px] divide-y divide-gray-200">
      {dayBookings.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          No bookings scheduled for this day
        </div>
      ) : (
        dayBookings.map(booking => (
          <button
            key={booking.id}
            onClick={() => onBookingSelect(booking)}
            className={cn(
              "w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors",
              booking.status === 'cancelled' && "border border-red-200 bg-red-50/50"
            )}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={cn(
                  "text-sm font-medium",
                  booking.status === 'cancelled' ? "text-red-500/75" : "text-gray-900"
                )}>
                  {format(new Date(booking.booking_date), 'HH:mm')} - {booking.channels.name}
                </p>
                <p className={cn(
                  "text-sm",
                  booking.status === 'cancelled' ? "text-red-500/60" : "text-gray-500"
                )}>
                  {booking.userEmail}
                </p>
              </div>
              <div className={cn(
                "text-sm",
                booking.status === 'cancelled' ? "text-red-500/60" : "text-gray-500"
              )}>
                {booking.product_link && '→'}
              </div>
            </div>
          </button>
        ))
      )}
    </div>
  );
}