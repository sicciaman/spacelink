import { motion } from 'framer-motion';
import { Check, Star } from 'lucide-react';
import { useSubscription } from '../../hooks/useSubscription';
import toast from 'react-hot-toast';

export default function SubscriptionCard() {
  const { subscription, subscribe, isSubscribed } = useSubscription();

  const handleSubscribe = async () => {
    try {
      await subscribe.mutateAsync();
      toast.success('Successfully subscribed to SpaceLink Prime!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to subscribe');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-xl overflow-hidden"
    >
      <div className="p-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">SpaceLink Prime</h3>
            <p className="mt-2 text-gray-500">Unlock premium features and priority access</p>
          </div>
          <Star className="h-8 w-8 text-yellow-400" />
        </div>

        <div className="mt-6">
          <p className="text-5xl font-bold text-gray-900">€48</p>
          <p className="text-gray-500">/month</p>
        </div>

        <ul className="mt-8 space-y-4">
          {[
            'Access to bundle pricing',
            'Priority time slot selection',
            '30-day advance booking',
            'Priority during peak periods',
            'Premium support',
            'Advanced analytics'
          ].map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="h-5 w-5 text-green-500 flex-shrink-0 mr-2" />
              <span className="text-gray-600">{feature}</span>
            </li>
          ))}
        </ul>

        <button
          onClick={handleSubscribe}
          disabled={isSubscribed || subscribe.isLoading}
          className="mt-8 w-full bg-blue-600 text-white rounded-lg py-3 px-4 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubscribed ? 'Already Subscribed' : 'Subscribe Now'}
        </button>
      </div>
    </motion.div>
  );
}