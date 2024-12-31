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

  const handleMockPayment = () => {
    // Simulate payment processing
    setTimeout(() => {
      const mockPaymentData = {
        orderID: `MOCK-${Date.now()}`,
        details: {
          id: `MOCK-${Date.now()}`,
          status: 'COMPLETED',
          purchase_units: [{
            amount: {
              value: selectedPackage.price.toString(),
              currency_code: 'EUR'
            }
          }]
        }
      };

      toast.success('Mock payment successful!');
      onSuccess(mockPaymentData);
    }, 1500); // Simulate network delay
  };

  return (
    <section>
      <h2 className="text-lg font-medium text-gray-900 mb-4">Complete Payment</h2>
      <div className="mb-6">
        <p className="text-gray-600">Selected package: {selectedPackage.name}</p>
        <p className="text-lg font-medium">Total: €{selectedPackage.price}</p>
      </div>
      
      {/* Mock PayPal Button */}
      <button
        onClick={handleMockPayment}
        className="w-full bg-[#FFC439] hover:bg-[#F4BB33] text-[#253B80] font-bold py-3 px-4 rounded-md transition-colors flex items-center justify-center space-x-2"
      >
        <span>Pay with</span>
        <span className="font-black">Pay</span>
        <span className="text-[#179BD7] font-black">Pal</span>
      </button>

      <div className="mt-4 text-xs text-gray-500 text-center">
        This is a mock payment system for testing purposes.
        No real transactions will be processed.
      </div>
    </section>
  );
}