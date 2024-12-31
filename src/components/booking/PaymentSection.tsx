import { PayPalButtons } from '@paypal/react-paypal-js';
import { usePackages } from '../../hooks/usePackages';
import toast from 'react-hot-toast';

interface Props {
  channelId: string;
  packageId: string;
  onSuccess: (data: any) => void;
}

export default function PaymentSection({ channelId, packageId, onSuccess }: Props) {
  const { data: packages } = usePackages(channelId);
  const selectedPackage = packages?.find(p => p.id === packageId);

  if (!selectedPackage) return null;

  return (
    <section>
      <h2 className="text-lg font-medium text-gray-900 mb-4">Complete Payment</h2>
      <div className="mb-6">
        <p className="text-gray-600">Selected package: {selectedPackage.name}</p>
        <p className="text-lg font-medium">Total: €{selectedPackage.price}</p>
      </div>
      <PayPalButtons
        createOrder={(_, actions) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: selectedPackage.price.toString(),
                currency_code: 'EUR'
              }
            }]
          });
        }}
        onApprove={(data, actions) => {
          return actions.order!.capture().then((details) => {
            toast.success('Payment successful!');
            onSuccess({ ...data, details });
          });
        }}
        onError={() => {
          toast.error('Payment failed. Please try again.');
        }}
      />
    </section>
  );
}