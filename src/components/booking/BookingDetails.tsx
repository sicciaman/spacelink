import { useState } from 'react';
import { format } from 'date-fns';
import { Edit2, ExternalLink } from 'lucide-react';
import type { Booking } from '../../lib/types';
import EditBookingForm from './EditBookingForm';

interface Props {
  booking: Booking;
  onUpdate: (bookingId: string, updates: Partial<Booking>) => void;
}

export default function BookingDetails({ booking, onUpdate }: Props) {
  const [isEditing, setIsEditing] = useState(false);

  const discount = ((booking.start_price - booking.discount_price) / booking.start_price * 100).toFixed(0);

  if (isEditing) {
    return (
      <EditBookingForm 
        booking={booking} 
        onSubmit={(updates) => {
          onUpdate(booking.id, updates);
          setIsEditing(false);
        }}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Booking Details</h3>
          <p className="mt-1 text-sm text-gray-500">
            {format(new Date(booking.booking_date), 'PPpp')}
          </p>
        </div>
        {booking.status === 'pending' && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center text-sm text-blue-600 hover:text-blue-500"
          >
            <Edit2 className="w-4 h-4 mr-1" />
            Edit
          </button>
        )}
      </div>

      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        <div>
          <p className="text-sm font-medium text-gray-500">Product Link</p>
          <a 
            href={booking.product_link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 text-sm text-blue-600 hover:text-blue-500 flex items-center"
          >
            {booking.product_link}
            <ExternalLink className="w-4 h-4 ml-1" />
          </a>
        </div>

        {booking.coupon && (
          <div>
            <p className="text-sm font-medium text-gray-500">Coupon Code</p>
            <p className="mt-1 text-sm font-mono bg-gray-100 px-2 py-1 rounded inline-block">
              {booking.coupon}
            </p>
          </div>
        )}

        <div>
          <p className="text-sm font-medium text-gray-500">Pricing</p>
          <div className="mt-1 flex items-baseline text-sm">
            <span className="text-gray-500 line-through">€{booking.start_price.toFixed(2)}</span>
            <span className="ml-2 text-green-600 font-medium">€{booking.discount_price.toFixed(2)}</span>
            <span className="ml-2 text-green-600">(-{discount}%)</span>
          </div>
        </div>
      </div>
    </div>
  );
}