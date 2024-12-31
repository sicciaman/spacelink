import { useState } from 'react';
import { useSubscription } from '../../hooks/useSubscription';
import { format } from 'date-fns';
import { Star, AlertTriangle } from 'lucide-react';
import ConfirmDialog from '../common/ConfirmDialog';
import PrimeModal from '../subscription/PrimeModal';
import toast from 'react-hot-toast';

export default function SubscriptionManager() {
  const { subscription, cancelSubscription, reactivateSubscription } = useSubscription();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showPrimeModal, setShowPrimeModal] = useState(false);

  const handleCancel = async () => {
    try {
      await cancelSubscription.mutateAsync();
      setShowCancelDialog(false);
      toast.success('Subscription cancelled. You can continue using Prime features until the end of your billing period.');
    } catch (error: any) {
      toast.error(error.message || 'Failed to cancel subscription');
    }
  };

  const handleReactivate = async () => {
    try {
      await reactivateSubscription.mutateAsync();
      toast.success('Subscription reactivated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to reactivate subscription');
    }
  };

  if (!subscription) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center mb-6">
          <Star className="h-6 w-6 text-yellow-400 mr-2" />
          <h2 className="text-lg font-medium text-gray-900">SpaceLink Prime</h2>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-700">
            Upgrade to SpaceLink Prime to unlock exclusive features and save up to 30% on your posts.
          </p>
        </div>

        <button
          onClick={() => setShowPrimeModal(true)}
          className="w-full bg-blue-600 text-white rounded-lg py-2 px-4 hover:bg-blue-700"
        >
          Learn More About Prime
        </button>

        <PrimeModal 
          isOpen={showPrimeModal}
          onClose={() => setShowPrimeModal(false)}
        />
      </div>
    );
  }

  const periodEnd = new Date(subscription.current_period_end);
  const isPeriodValid = periodEnd > new Date();
  const isCancelled = subscription.status === 'cancelled';

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Star className="h-6 w-6 text-yellow-400 mr-2" />
          <h2 className="text-lg font-medium text-gray-900">SpaceLink Prime</h2>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          isCancelled ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
        }`}>
          {isCancelled ? 'Cancelling Soon' : 'Active'}
        </span>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-6">
        <div>
          <p className="text-sm text-gray-500">Current Period</p>
          <p className="mt-1 text-sm font-medium text-gray-900">
            {format(new Date(subscription.current_period_start), 'PP')} - {format(periodEnd, 'PP')}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Price</p>
          <p className="mt-1 text-sm font-medium text-gray-900">€48.00/month</p>
        </div>
      </div>

      {isCancelled && isPeriodValid && (
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2" />
            <div className="flex-1">
              <p className="text-sm text-yellow-800">
                Your subscription will end on {format(periodEnd, 'PP')}. You can continue using Prime features and purchasing bundles until then.
              </p>
              <button
                onClick={handleReactivate}
                className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Reactivate Subscription
              </button>
            </div>
          </div>
        </div>
      )}

      {!isCancelled && (
        <div className="mt-6">
          <button
            onClick={() => setShowCancelDialog(true)}
            className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
          >
            Cancel Subscription
          </button>
        </div>
      )}

      <ConfirmDialog
        isOpen={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        onConfirm={handleCancel}
        title="Cancel Subscription"
        message="Your subscription will remain active until the end of your current billing period. During this time, you can continue using Prime features and purchasing bundles. Are you sure you want to cancel?"
        confirmText="Yes, Cancel"
        cancelText="Keep Subscription"
      />
    </div>
  );
}