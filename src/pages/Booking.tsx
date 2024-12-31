import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import ChannelSelector from '../components/booking/ChannelSelector';
import PackageSelector from '../components/booking/PackageSelector';
import DateSelector from '../components/booking/DateSelector';
import PaymentSection from '../components/booking/PaymentSection';
import { useBookingStore } from '../stores/useBookingStore';
import { combineDateTime, formatDateTime } from '../lib/utils/dateTime';
import toast from 'react-hot-toast';

export default function Booking() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const { 
    selectedChannel, 
    selectedPackage, 
    selectedDate,
    selectedTime,
    setSelectedChannel,
    setSelectedPackage,
    setSelectedDate,
    setSelectedTime,
    reset
  } = useBookingStore();

  const handleChannelSelect = (channelId: string) => {
    setSelectedChannel(channelId);
    setStep(2);
  };

  const handlePackageSelect = (packageId: string) => {
    setSelectedPackage(packageId);
    setStep(3);
  };

  const handleDateTimeSelect = (date: Date | null, time: string | null) => {
    setSelectedDate(date);
    setSelectedTime(time);
    if (date && time) {
      setStep(4);
    }
  };

  const handlePaymentSuccess = async (paymentData: any) => {
    try {
      if (!user || !selectedChannel || !selectedPackage || !selectedDate || !selectedTime) return;

      // Create purchase record
      const { data: purchase, error: purchaseError } = await supabase
        .from('purchases')
        .insert({
          user_id: user.id,
          package_id: selectedPackage,
          payment_id: paymentData.orderID,
          payment_status: 'completed',
          amount_paid: paymentData.details.purchase_units[0].amount.value,
          posts_remaining: 1,
          expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
        })
        .select()
        .single();

      if (purchaseError) throw purchaseError;

      // Verify slot is still available
      const bookingDate = combineDateTime(selectedDate, selectedTime);
      const { count, error: conflictError } = await supabase
        .from('bookings')
        .select('*', { count: 'exact' })
        .eq('channel_id', selectedChannel)
        .eq('booking_date', formatDateTime(bookingDate))
        .neq('status', 'cancelled');

      if (conflictError) throw conflictError;
      
      if (count && count > 0) {
        throw new Error('This time slot is no longer available');
      }

      // Create booking record
      const { error: bookingError } = await supabase
        .from('bookings')
        .insert({
          user_id: user.id,
          purchase_id: purchase.id,
          channel_id: selectedChannel,
          booking_date: formatDateTime(bookingDate),
          status: 'pending'
        });

      if (bookingError) throw bookingError;

      toast.success('Booking completed successfully!');
      reset();
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error creating booking:', error);
      toast.error(error.message || 'Failed to complete booking. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="space-y-8">
            <div className={step === 1 ? '' : 'hidden'}>
              <ChannelSelector
                selectedChannel={selectedChannel}
                onSelect={handleChannelSelect}
              />
            </div>

            <div className={step === 2 ? '' : 'hidden'}>
              <PackageSelector
                channelId={selectedChannel}
                selectedPackage={selectedPackage}
                onSelect={handlePackageSelect}
              />
            </div>

            <div className={step === 3 ? '' : 'hidden'}>
              <DateSelector
                channelId={selectedChannel}
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                onSelect={handleDateTimeSelect}
              />
            </div>

            <div className={step === 4 ? '' : 'hidden'}>
              {selectedChannel && selectedPackage && (
                <PaymentSection
                  channelId={selectedChannel}
                  packageId={selectedPackage}
                  onSuccess={handlePaymentSuccess}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}