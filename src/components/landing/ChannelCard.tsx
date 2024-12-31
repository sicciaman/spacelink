import { Check } from 'lucide-react';
import { motion } from 'framer-motion';
import type { PricingTier } from './types';

interface ChannelCardProps {
  channel: PricingTier;
  index: number;
}

export default function ChannelCard({ channel, index }: ChannelCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="rounded-3xl bg-white p-8 ring-1 ring-gray-200 xl:p-10 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
    >
      <div className="flex items-center justify-between gap-x-4">
        <h3 className="text-lg font-semibold leading-8 text-gray-900">
          {channel.name}
        </h3>
      </div>
      <p className="mt-2 text-sm leading-6 text-gray-600">
        {channel.description}
      </p>
      <motion.p 
        className="mt-6 flex items-baseline gap-x-1"
        whileHover={{ scale: 1.05 }}
      >
        <span className="text-4xl font-bold tracking-tight text-gray-900">€{channel.price}</span>
        <span className="text-sm font-semibold leading-6 text-gray-600">/post</span>
      </motion.p>

      <div className="mt-8 space-y-6">
        {channel.bundles.map((bundle, idx) => (
          <motion.div
            key={idx}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 + idx * 0.1 }}
            className="flex items-center gap-x-2 text-sm leading-6 text-gray-600"
          >
            <Check className="h-5 w-5 flex-none text-blue-600" />
            <span>
              <strong>{bundle.posts} posts</strong> bundle for <strong>€{bundle.price}</strong>{' '}
              <span className="text-green-600">(save €{bundle.savings})</span>
            </span>
          </motion.div>
        ))}
      </div>

      <motion.a
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        href={channel.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      >
        Join Channel
      </motion.a>
    </motion.div>
  );
}