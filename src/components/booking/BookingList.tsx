import { useState } from 'react';
import { format } from 'date-fns';
import { ExternalLink } from 'lucide-react';
import { useBookings } from '../../hooks/useBookings';
import { useUpdateBooking } from '../../hooks/useUpdateBooking';
import { BookingStatus } from '../../lib/types';
import { statusColors } from '../../lib/utils/styles';
import BookingStatusFilter from './BookingStatusFilter';
import EditBookingForm from './EditBookingForm';
import EmptyBookings from './EmptyBookings';
import toast from 'react-hot-toast';

interface Props {
  onCancelBooking: (bookingId: string, purchaseId: string, bookingDate: string) => void;
  canCancelBooking: (bookingDate: string) => boolean;
}

export default function BookingList({ onCancelBooking, canCancelBooking }: Props) {
  const [selectedStatus, setSelectedStatus] = useState<BookingStatus>('pending');
  const { data: bookings, isLoading } = useBookings(selectedStatus);
  const updateBooking = useUpdateBooking();
  const [editingBookingId, setEditingBookingId] = useState<string | null>(null);

  const handleUpdateBooking = async (bookingId: string, updates: any) => {
    try {
      await updateBooking.mutateAsync({ bookingId, updates });
      setEditingBookingId(null);
      toast.success('Booking updated successfully');
    } catch (error) {
      toast.error('Failed to update booking');
    }
  };

  return (
    <div className="space-y-4">
      <BookingStatusFilter
        selectedStatus={selectedStatus}
        onChange={setSelectedStatus}
      />

      {isLoading ? (
        <div className="text-center py-4">Loading bookings...</div>
      ) : !bookings?.length ? (
        <EmptyBookings status={selectedStatus} />
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {bookings.map((booking) => (
              <li key={booking.id} className="hover:bg-gray-50">
                {editingBookingId === booking.id ? (
                  <div className="p-4">
                    <EditBookingForm
                      booking={booking}
                      onSubmit={(updates) => handleUpdateBooking(booking.id, updates)}
                      onCancel={() => setEditingBookingId(null)}
                    />
                  </div>
                ) : (
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-blue-600">
                              {booking.channels?.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {format(new Date(booking.booking_date), 'PPp')}
                            </p>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              statusColors[booking.status]
                            }`}>
                              {booking.status}
                            </span>
                            {booking.status === 'pending' && (
                              <>
                                {canCancelBooking(booking.booking_date) && (
                                  <button
                                    onClick={() => onCancelBooking(booking.id, booking.purchase_id, booking.booking_date)}
                                    className="text-sm text-red-600 hover:text-red-500"
                                  >
                                    Cancel
                                  </button>
                                )}
                                <button
                                  onClick={() => setEditingBookingId(booking.id)}
                                  className="text-sm text-blue-600 hover:text-blue-500"
                                >
                                  Edit
                                </button>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <div className="flex items-center space-x-1">
                              <a
                                href={booking.product_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-gray-900 hover:text-blue-600 truncate flex items-center"
                              >
                                {booking.product_link}
                                <ExternalLink className="ml-1 h-3 w-3" />
                              </a>
                            </div>
                            {booking.coupon && (
                              <p className="mt-1 text-sm">
                                <span className="text-gray-500">Coupon:</span>{' '}
                                <span className="font-mono bg-gray-100 px-1 py-0.5 rounded">
                                  {booking.coupon}
                                </span>
                              </p>
                            )}
                          </div>
                          <div className="text-sm">
                            <div className="flex items-baseline space-x-2">
                              <span className="text-gray-500 line-through">
                                €{booking.start_price.toFixed(2)}
                              </span>
                              <span className="text-green-600 font-medium">
                                €{booking.discount_price.toFixed(2)}
                              </span>
                              <span className="text-green-600">
                                (-{((booking.start_price - booking.discount_price) / booking.start_price * 100).toFixed(0)}%)
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}