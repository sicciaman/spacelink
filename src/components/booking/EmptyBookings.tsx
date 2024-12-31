import { Calendar } from 'lucide-react';
import { BookingStatus } from '../../lib/types';

interface Props {
  status: BookingStatus;
}

export default function EmptyBookings({ status }: Props) {
  const getMessage = () => {
    switch (status) {
      case 'pending':
        return 'No upcoming bookings found';
      case 'completed':
        return 'No completed bookings found';
      case 'cancelled':
        return 'No cancelled bookings found';
      default:
        return 'No bookings found';
    }
  };

  return (
    <div className="text-center py-12">
      <Calendar className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-sm font-semibold text-gray-900">{getMessage()}</h3>
      <p className="mt-1 text-sm text-gray-500">
        Check back later or adjust your filters
      </p>
    </div>
  );
}