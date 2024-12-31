import { useState } from 'react';
import { format } from 'date-fns';
import { X, Edit2, ExternalLink } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import type { Booking } from '../../../lib/types';
import toast from 'react-hot-toast';
import { cn } from '../../../lib/utils/styles';
import EditBookingForm from './EditBookingForm';

interface Props {
  booking: Booking & { userEmail: string };
  onClose: () => void;
}

export default function BookingDetailsPanel({ booking, onClose }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();
  const discount = ((booking.start_price - booking.discount_price) / booking.start_price * 100).toFixed(0);

  const handleCancel = async (restorePost: boolean) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.rpc('admin_cancel_booking', {
        p_booking_id: booking.id,
        p_restore_post: restorePost
      });

      if (error) throw error;

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['admin-bookings'] }),
        queryClient.invalidateQueries({ queryKey: ['admin-calendar-bookings'] })
      ]);
      
      toast.success('Booking cancelled successfully');
      onClose();
    } catch (error: any) {
      console.error('Error cancelling booking:', error);
      toast.error(error.message || 'Failed to cancel booking');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-gray-600 bg-opacity-50 transition-opacity z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed inset-y-0 right-0 w-[480px] bg-white shadow-xl border-l border-gray-200 z-50 overflow-hidden flex flex-col">
        <div className="flex-none p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Booking Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {isEditing ? (
              <EditBookingForm
                booking={booking}
                onCancel={() => setIsEditing(false)}
                onSuccess={() => {
                  setIsEditing(false);
                  queryClient.invalidateQueries({ 
                    queryKey: ['admin-bookings']
                  });
                  queryClient.invalidateQueries({ 
                    queryKey: ['admin-calendar-bookings']
                  });
                }}
              />
            ) : (
              <div className="space-y-6">
                {/* Details content */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Customer</h3>
                  <p className="mt-1 text-sm text-gray-900">{booking.userEmail}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Channel</h3>
                  <p className="mt-1 text-sm text-gray-900">{booking.channels.name}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Date & Time</h3>
                  <p className="mt-1 text-sm text-gray-900">
                    {format(new Date(booking.booking_date), 'PPpp')}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Product Link</h3>
                  <a 
                    href={booking.product_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 text-sm text-blue-600 hover:text-blue-500 flex items-center"
                  >
                    <span className="truncate">{booking.product_link}</span>
                    <ExternalLink className="ml-1 h-4 w-4 flex-none" />
                  </a>
                </div>

                {booking.coupon && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Coupon</h3>
                    <p className="mt-1 text-sm font-mono bg-gray-100 px-2 py-1 rounded inline-block">
                      {booking.coupon}
                    </p>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Pricing</h3>
                  <div className="mt-1 flex items-baseline text-sm">
                    <span className="text-gray-500 line-through">€{booking.start_price.toFixed(2)}</span>
                    <span className="ml-2 text-green-600 font-medium">€{booking.discount_price.toFixed(2)}</span>
                    <span className="ml-2 text-green-600">(-{discount}%)</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <p className={cn(
                    "mt-1 text-sm font-medium",
                    booking.status === 'pending' ? "text-yellow-600" :
                    booking.status === 'completed' ? "text-green-600" :
                    "text-red-600"
                  )}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        {booking.status === 'pending' && !isEditing && (
          <div className="flex-none p-6 bg-gray-50 border-t border-gray-200">
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setIsEditing(true)}
                disabled={isLoading}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Booking
              </button>
              <button
                onClick={() => handleCancel(true)}
                disabled={isLoading}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
              >
                Cancel & Restore Post
              </button>
              <button
                onClick={() => handleCancel(false)}
                disabled={isLoading}
                className="inline-flex items-center justify-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 disabled:opacity-50"
              >
                Cancel Without Restoring
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}