import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { addDays } from 'date-fns';
import { CreditCard, Loader2, Package, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import { usePackages } from '../../hooks/usePackages';
import { supabase } from '../../lib/supabase';

interface Props {
  channelId: string;
  packageId: string;
  onSuccess: (data: any) => void;
}

export default function PaymentSection({ channelId, packageId, onSuccess }: Props) {
  const { user } = useAuth();
  const { data: packages, isLoading: loadingPackages } = usePackages(channelId);
  const selectedPackage = packages?.find(p => p.id === packageId);

  const isLoading = loadingPackages;

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-gray-700" />
      </div>
    );
  }

  // If no package or channel is selected, render nothing
  if (!selectedPackage || !channelId || !user) return null;

  // PayPal fee calculation
  const PAYPAL_PERCENTAGE_FEE = 0.0349; // 3.49%
  const PAYPAL_FIXED_FEE = 0.35; // €0.35

  const calculateTotalWithFee = (baseAmount: number) => {
    return (baseAmount + PAYPAL_FIXED_FEE) / (1 - PAYPAL_PERCENTAGE_FEE);
  };

  const totalWithFee = calculateTotalWithFee(selectedPackage.price);
  const feeAmount = totalWithFee - selectedPackage.price;

  // Handle payment approval
  const onApprove = async (data: any, actions: any) => {
    try {
      const details = await actions.order.capture();

      const { data: purchase, error } = await supabase
        .from('purchases')
        .insert({
          user_id: user.id,
          package_id: packageId,
          payment_id: details.id,
          payment_status: 'completed',
          amount_paid: selectedPackage.price.toFixed(2),
          posts_remaining: selectedPackage.post_count,
          expires_at: addDays(new Date(), 60).toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      toast.success('Payment completed successfully!', purchase);
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
    <section className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Channel Header */}
        {/* <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
          <div className="flex items-center space-x-4">
            {channel.logo_url ? (
              <img 
                src={channel.logo_url} 
                alt={channel.name}
                className="w-16 h-16 rounded-full bg-white p-1"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                <span className="text-2xl font-bold">{channel.name[0]}</span>
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold">{channel.name}</h1>
              <p className="text-blue-100">Complete your purchase</p>
            </div>
          </div>
        </div> */}

        <div className="p-6">
          {/* Package Details */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Package className="w-5 h-5 mr-2" />
              Package Details
            </h2>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="font-medium text-lg text-gray-800">{selectedPackage.name}</h3>
              <div className="bg-white p-3 rounded border border-gray-200">
                <p className="text-sm text-gray-500">Base Price</p>
                <p className="font-medium text-gray-800">€{selectedPackage.price.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              Payment Details
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Base Price</span>
                <span className="font-medium">€{selectedPackage.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">PayPal Processing Fee</span>
                <span className="font-medium">€{feeAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 text-lg font-semibold">
                <span>Total</span>
                <span>€{totalWithFee.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* PayPal Button */}
          <div className="mb-6">
            <PayPalScriptProvider options={{ 
                  clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID ,
                  currency: 'EUR',
                  intent: 'capture',
                  vault: true
                }}>
              <PayPalButtons
                style={{
                  layout: 'vertical',
                  shape: 'rect',
                  label: 'pay',
                }}
                createOrder={async (data, actions) => {
                  return actions.order.create({
                    intent: 'CAPTURE',
                    purchase_units: [
                      {
                        amount: {
                          currency_code: 'EUR',
                          value: totalWithFee.toFixed(2),
                        }
                      },
                    ],
                  });
                }}
                onApprove={onApprove}
                onError={onError}
              />
            </PayPalScriptProvider>
          </div>

          {/* Security Notice */}
          <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Shield className="w-4 h-4 text-green-500" />
              <span className="font-medium text-gray-700">Secure Payment</span>
            </div>
            <p className="mb-2">Your payment is processed securely through PayPal. We never store your payment details.</p>
            <p>By proceeding with the payment, you agree to our <a href="/terms" className="text-blue-500 hover:text-blue-600 underline">Terms and Conditions</a>.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
