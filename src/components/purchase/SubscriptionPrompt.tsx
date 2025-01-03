import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useState } from 'react';
import { useSubscription } from '../../hooks/useSubscription';
import PrimeModal from '../subscription/PrimeModal';
import toast from 'react-hot-toast';

export default function SubscriptionPrompt() {
  const [showModal, setShowModal] = useState(false);
  const { subscription, reactivateSubscription, isSubscribed, isCancelled } = useSubscription();

  // Hide prompt if subscription is active
  if (isSubscribed) return null;

  const handleReactivate = async () => {
    try {
      await reactivateSubscription.mutateAsync();
      toast.success('Subscription reactivated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to reactivate subscription');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 shadow-sm border border-blue-100"
    >
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <Star className="h-8 w-8 text-yellow-400" />
        </div>
        <div>
          {isCancelled ? (
            <>
              <h3 className="text-lg font-semibold text-gray-900">
                Reactivate Your Prime Subscription
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Your subscription is currently set to cancel at the end of the billing period. 
                Reactivate now to keep enjoying Prime benefits without interruption.
              </p>
              <div className="mt-4">
                <button
                  onClick={handleReactivate}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  Reactivate Subscription
                </button>
              </div>
            </>
          ) : (
            <>
              <h3 className="text-lg font-semibold text-gray-900">
                Unlock Bundle Pricing with SpaceLink Prime
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Subscribe to SpaceLink Prime to access exclusive bundle packages and save up to 30% on your posts.
                Plus, enjoy priority booking and extended scheduling options.
              </p>
              <div className="mt-4">
                <button
                  onClick={() => setShowModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  Learn More About Prime
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <PrimeModal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </motion.div>
  );
}