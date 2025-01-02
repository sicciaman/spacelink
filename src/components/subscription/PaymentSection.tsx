import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, CreditCard, Calendar, CheckCircle } from 'lucide-react';
import { useSubscription } from '../../hooks/useSubscription';
import toast from 'react-hot-toast';

interface Props {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function PaymentSection({ onSuccess, onCancel }: Props) {
  const { subscribe } = useSubscription();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleMockPayment = async () => {
    try {
      setIsProcessing(true);
      // Simulate payment processing delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Create subscription
      await subscribe.mutateAsync();

      toast.success('Successfully subscribed to SpaceLink Prime!');
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || 'Failed to process payment');
      onCancel?.();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <Shield className="mx-auto h-12 w-12 text-blue-600" />
        <h2 className="mt-4 text-2xl font-bold text-gray-900">
          Complete Your Subscription
        </h2>
        <p className="mt-2 text-gray-600">
          You're just one step away from unlocking all Prime features
        </p>
      </motion.div>

      <div className="bg-gray-50 rounded-xl p-6 space-y-4">
        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              SpaceLink Prime
            </h3>
            <p className="text-sm text-gray-500">Monthly Subscription</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">€48.00</p>
            <p className="text-sm text-gray-500">per month</p>
          </div>
        </div>

        <div className="space-y-3 py-4">
          <div className="flex items-center text-sm text-gray-600">
            <CreditCard className="h-4 w-4 mr-2 text-blue-600" />
            Secure payment processing
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2 text-blue-600" />
            Cancel anytime, no commitment
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <CheckCircle className="h-4 w-4 mr-2 text-blue-600" />
            Instant access to all Prime features
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <button
          onClick={handleMockPayment}
          disabled={isProcessing}
          className="w-full relative bg-[#FFC439] hover:bg-[#F4BB33] text-[#253B80] font-bold py-4 px-6 rounded-lg transition-all duration-200 disabled:opacity-75"
        >
          <div className="flex items-center justify-center">
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#253B80] mr-3" />
                Processing...
              </>
            ) : (
              <>
                <span>Pay with</span>
                <span className="font-black mx-1">Pay</span>
                <span className="text-[#179BD7] font-black">Pal</span>
              </>
            )}
          </div>
        </button>

        <button
          onClick={onCancel}
          disabled={isProcessing}
          className="w-full text-sm text-gray-600 hover:text-gray-800 py-2"
        >
          Cancel
        </button>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            By subscribing, you agree to our terms and conditions. Your
            subscription will automatically renew each month.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
