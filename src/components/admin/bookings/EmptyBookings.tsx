import { Calendar } from 'lucide-react';
import EmptyState from '../EmptyState';
import { BookingStatus } from '../../../lib/types';

interface Props {
  status: BookingStatus;
}

export default function EmptyBookings({ status }: Props) {
  const getMessage = () => {
    switch (status) {
      case 'pending':
        return {
          title: 'No Pending Bookings',
          description: 'There are currently no pending bookings to display.'
        };
      case 'completed':
        return {
          title: 'No Completed Bookings',
          description: 'No bookings have been completed yet.'
        };
      case 'cancelled':
        return {
          title: 'No Cancelled Bookings',
          description: 'No bookings have been cancelled.'
        };
      default:
        return {
          title: 'No Bookings Found',
          description: 'No bookings match the current filters.'
        };
    }
  };

  const message = getMessage();

  return (
    <EmptyState
      icon={Calendar}
      title={message.title}
      description={message.description}
    />
  );
}