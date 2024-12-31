import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthGuard } from '../hooks/useAuthGuard';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { usePurchase } from '../hooks/usePurchase';
import DateSelector from '../components/booking/DateSelector';
import ProductInfoForm, { ProductInfo } from '../components/booking/ProductInfoForm';
import BookingConfirmDialog from '../components/booking/BookingConfirmDialog';
import { combineDateTime, formatDateTime } from '../lib/utils/dateTime';
import StepNavigation from '../components/booking/StepNavigation';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';

type BookingStep = 'datetime' | 'product';

export default function BookSlot() {
  useAuthGuard();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { purchaseId } = useParams();
  const { data: purchase, isLoading: purchaseLoading } = usePurchase(purchaseId);
  
  const [step, setStep] = useState<BookingStep>('datetime');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [productInfo, setProductInfo] = useState<ProductInfo | null>(null);

  if (purchaseLoading) {
    return <div>Loading...</div>;
  }

  if (!purchase) {
    return <div>Package not found</div>;
  }

  const handleDateTimeSelect = (date: Date | null, time: string | null) => {
    setSelectedDate(date);
    setSelectedTime(time);
  };

  const handleContinue = () => {
    if (selectedDate && selectedTime) {
      setStep('product');
    }
  };

  const handleProductSubmit = (info: ProductInfo) => {
    setProductInfo(info);
    setShowConfirmDialog(true);
  };

  const handleConfirmBooking = async () => {
    if (!user || !selectedDate || !selectedTime || !productInfo) return;

    try {
      const bookingDate = combineDateTime(selectedDate, selectedTime);
      
      const { error } = await supabase.rpc('create_booking_with_update', {
        p_user_id: user.id,
        p_purchase_id: purchase.id,
        p_channel_id: purchase.packages.channel_id,
        p_booking_date: formatDateTime(bookingDate),
        p_product_link: productInfo.productLink,
        p_coupon: productInfo.coupon || null,
        p_start_price: productInfo.startPrice,
        p_discount_price: productInfo.discountPrice
      });

      if (error) throw error;

      // Invalidate queries to refresh data
      await queryClient.invalidateQueries({ queryKey: ['purchases'] });
      await queryClient.invalidateQueries({ queryKey: ['bookings'] });

      toast.success('Booking completed successfully!');
      navigate('/');
    } catch (error: any) {
      console.error('Booking error:', error);
      toast.error(error.message || 'Failed to complete booking');
    } finally {
      setShowConfirmDialog(false);
    }
  };

  const handleBack = () => {
    if (step === 'product') {
      setStep('datetime');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <StepNavigation 
            title={step === 'datetime' ? 'Select Date and Time' : 'Enter Product Details'}
            canGoBack={true}
            onBack={handleBack}
          />

          {step === 'datetime' && (
            <DateSelector
              channelId={purchase.packages.channel_id}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onSelect={handleDateTimeSelect}
              onContinue={handleContinue}
            />
          )}

          {step === 'product' && (
            <ProductInfoForm onSubmit={handleProductSubmit} />
          )}
        </div>
      </div>

      {showConfirmDialog && selectedDate && selectedTime && productInfo && (
        <BookingConfirmDialog
          isOpen={showConfirmDialog}
          onClose={() => setShowConfirmDialog(false)}
          onConfirm={handleConfirmBooking}
          date={selectedDate}
          time={selectedTime}
          productInfo={productInfo}
        />
      )}
    </div>
  );
}