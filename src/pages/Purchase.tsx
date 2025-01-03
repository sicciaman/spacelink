import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import StepNavigation from '../components/booking/StepNavigation';
import ChannelSelector from '../components/purchase/ChannelSelector';
import PackageSelector from '../components/purchase/PackageSelector';
import PaymentSection from '../components/purchase/PaymentSection';
import { useAuth } from '../hooks/useAuth';
import { useAuthGuard } from '../hooks/useAuthGuard';

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

  const handlePaymentSuccess = async (purchase: any) => {
    try {
      console.log('Payment completed successfully!', purchase);
      // Invalidate purchases query to refresh the dashboard
      await queryClient.invalidateQueries({ queryKey: ['purchases'] });
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