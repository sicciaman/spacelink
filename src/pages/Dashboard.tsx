import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthGuard } from '../hooks/useAuthGuard';
import { usePurchases } from '../hooks/usePurchases';
import { useCancelBooking } from '../hooks/useBookings';
import { canCancelBooking } from '../lib/utils/booking';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import ConfirmDialog from '../components/common/ConfirmDialog';
import BookingList from '../components/booking/BookingList';
import PackageList from '../components/purchase/PackageList';

export default function Dashboard() {
  useAuthGuard();
  const { data: purchases = [], isLoading: purchasesLoading } = usePurchases();
  const cancelBooking = useCancelBooking();
  const [bookingToCancel, setBookingToCancel] = useState<{
    id: string;
    purchaseId: string;
    date: string;
  } | null>(null);

  const handleCancelBooking = (bookingId: string, purchaseId: string, bookingDate: string) => {
    if (!canCancelBooking(bookingDate)) {
      toast.error('Bookings can only be cancelled at least 24 hours before the scheduled time');
      return;
    }
    setBookingToCancel({ id: bookingId, purchaseId, date: bookingDate });
  };

  const confirmCancelBooking = async () => {
    if (!bookingToCancel) return;

    try {
      await cancelBooking.mutateAsync({
        bookingId: bookingToCancel.id,
        purchaseId: bookingToCancel.purchaseId
      });
      toast.success('Booking cancelled successfully');
    } catch (error) {
      toast.error('Failed to cancel booking');
    } finally {
      setBookingToCancel(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Your Packages</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your promotional packages and bookings
          </p>
        </div>
        <Link
          to="/purchase"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Buy New Package
        </Link>
      </div>

      <PackageList 
        packages={purchases} 
        isLoading={purchasesLoading} 
      />

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Bookings</h2>
        <BookingList
          onCancelBooking={handleCancelBooking}
          canCancelBooking={canCancelBooking}
        />
      </div>

      <ConfirmDialog
        isOpen={!!bookingToCancel}
        onClose={() => setBookingToCancel(null)}
        onConfirm={confirmCancelBooking}
        title="Cancel Booking"
        message="Are you sure you want to cancel this booking? This action cannot be undone."
        confirmText="Cancel Booking"
        cancelText="Keep Booking"
      />
    </div>
  );
}