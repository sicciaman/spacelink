import { format } from 'date-fns';
import { statusColors } from '../../../lib/utils/styles';
import type { Booking } from '../../../lib/types';

interface Props {
  booking: Booking & { userEmail: string };
  onSelect: (booking: Booking & { userEmail: string }) => void;
}

export default function AdminBookingRow({ booking, onSelect }: Props) {
  return (
    <tr 
      key={booking.id} 
      className="hover:bg-gray-50 cursor-pointer"
      onClick={() => onSelect(booking)}
    >
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {booking.userEmail}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {booking.channels.name}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {format(new Date(booking.booking_date), 'PPp')}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          statusColors[booking.status]
        }`}>
          {booking.status}
        </span>
      </td>
    </tr>
  );
}