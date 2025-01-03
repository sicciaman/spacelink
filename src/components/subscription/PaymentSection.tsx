import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle, CreditCard, Shield } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useSubscription } from '../../hooks/useSubscription';

interface Props {
  onSuccess: (data: any) => void;
  onCancel?: () => void;
}

export default function PaymentSection({ onSuccess, onCancel }: Props) {
  const { subscribe } = useSubscription();
  const [isProcessing, setIsProcessing] = useState(false);

    // Handle payment approval
    const onApprove = async (data: any, actions: any) => {
      try {
        const details = await actions.order.capture();

        console.log('Subscription payment details:', details);
  
        // Create subscription
        await subscribe.mutateAsync();

        toast.success('Successfully subscribed to SpaceLink Prime!');
        onSuccess(details);
      } catch (error) {
        console.error('Error processing payment:', error);
        toast.error('Payment could not be completed. Please contact support.');
      }
    };
  
    // Handle PayPal errors
    const onError = (err: any) => {
      console.error('PayPal error:', err);
      toast.error('Payment failed. Please try again or choose another method.');
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
          {/* PayPal Button */}
          <div className="mb-6">
            <PayPalScriptProvider options={{ 
                clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID ,
                currency: 'EUR',
                intent: 'subscription',
                vault: true
              }}>
              <PayPalButtons
                style={{
                  layout: 'vertical',
                  shape: 'rect',
                  label: 'pay',
                }}
                createSubscription={async (data, actions) => {
                  return actions.subscription.create({
                    plan_id: import.meta.env.VITE_SPACELINK_PRIME_PLAN_ID,
                  });
                }}
                onApprove={onApprove}
                onError={onError}
              />
            </PayPalScriptProvider>
          </div>

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
