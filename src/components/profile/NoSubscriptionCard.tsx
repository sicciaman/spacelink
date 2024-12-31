import { Star } from 'lucide-react';
import { motion } from 'framer-motion';
import PrimeModal from '../subscription/PrimeModal';
import { useState } from 'react';

export default function NoSubscriptionCard() {
  const [showModal, setShowModal] = useState(false);

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
          <h3 className="text-lg font-semibold text-gray-900">
            Upgrade to SpaceLink Prime
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            Get access to exclusive bundle packages and save up to 30% on your posts.
            Plus, enjoy priority booking and extended scheduling options.
          </p>
          <ul className="mt-4 space-y-2">
            <li className="flex items-center text-sm text-gray-600">
              • Access cost-saving bundles
            </li>
            <li className="flex items-center text-sm text-gray-600">
              • Choose strategic posting times
            </li>
            <li className="flex items-center text-sm text-gray-600">
              • Book up to 30 days in advance
            </li>
          </ul>
          <div className="mt-4">
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Learn More About Prime
            </button>
          </div>
        </div>
      </div>

      <PrimeModal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </motion.div>
  );
}