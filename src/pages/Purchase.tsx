import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthGuard } from '../hooks/useAuthGuard';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { useQueryClient } from '@tanstack/react-query';
import ChannelSelector from '../components/purchase/ChannelSelector';
import PackageSelector from '../components/purchase/PackageSelector';
import PaymentSection from '../components/purchase/PaymentSection';
import StepNavigation from '../components/booking/StepNavigation';
import toast from 'react-hot-toast';

export default function Purchase() {
  useAuthGuard();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(1);
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      if (step === 3) {
        setSelectedPackage(null);
      } else if (step === 2) {
        setSelectedChannel(null);
      }
    } else {
      navigate('/');
    }
  };

  const handleChannelSelect = (channelId: string) => {
    setSelectedChannel(channelId);
    setStep(2);
  };

  const handlePackageSelect = (packageId: string) => {
    setSelectedPackage(packageId);
    setStep(3);
  };

  const handlePaymentSuccess = async (paymentData: any) => {
    try {
      if (!user || !selectedPackage) return;

      const { data: packageData, error: packageError } = await supabase
        .from('packages')
        .select('post_count')
        .eq('id', selectedPackage)
        .single();

      if (packageError) throw packageError;

      const { error: purchaseError } = await supabase
        .from('purchases')
        .insert({
          user_id: user.id,
          package_id: selectedPackage,
          payment_id: paymentData.orderID,
          payment_status: 'completed',
          amount_paid: paymentData.details.purchase_units[0].amount.value,
          posts_remaining: packageData.post_count,
          expires_at: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString() // 60 days
        });

      if (purchaseError) throw purchaseError;

      // Invalidate purchases query to refresh the dashboard
      await queryClient.invalidateQueries({ queryKey: ['purchases'] });

      toast.success('Purchase completed successfully!');
      navigate('/');
    } catch (error: any) {
      console.error('Purchase error:', error);
      toast.error(error.message || 'Failed to complete purchase');
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return 'Select a Channel';
      case 2:
        return 'Choose a Package';
      case 3:
        return 'Complete Payment';
      default:
        return '';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <StepNavigation 
            title={getStepTitle()} 
            canGoBack={true}
            onBack={handleBack}
          />

          <div className="space-y-8">
            {step === 1 && (
              <ChannelSelector
                selectedChannel={selectedChannel}
                onSelect={handleChannelSelect}
              />
            )}

            {step === 2 && (
              <PackageSelector
                channelId={selectedChannel}
                selectedPackage={selectedPackage}
                onSelect={handlePackageSelect}
              />
            )}

            {step === 3 && selectedChannel && selectedPackage && (
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
  );
}