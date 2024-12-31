import { useState } from 'react';
import { BookingStatus } from '../../../lib/types';
import BookingStatusFilter from '../../booking/BookingStatusFilter';
import AdminBookingRow from './AdminBookingRow';
import EmptyBookings from './EmptyBookings';
import BookingDetailsPanel from './BookingDetailsPanel';
import ChannelFilter from '../../common/ChannelFilter';
import { useAdminBookings } from '../../../hooks/useAdminBookings';

export default function AdminBookingsTable() {
  const [selectedStatus, setSelectedStatus] = useState<BookingStatus>('pending');
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  const { data: bookings, isLoading } = useAdminBookings(selectedStatus, selectedChannel);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <BookingStatusFilter
          selectedStatus={selectedStatus}
          onChange={setSelectedStatus}
        />
        <ChannelFilter
          selectedChannel={selectedChannel}
          onChange={setSelectedChannel}
        />
      </div>

      {!bookings?.length ? (
        <EmptyBookings status={selectedStatus} />
      ) : (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Channel
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.map((booking) => (
                  <AdminBookingRow 
                    key={booking.id} 
                    booking={booking}
                    onSelect={setSelectedBooking}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedBooking && (
        <BookingDetailsPanel
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      )}
    </div>
  );
}