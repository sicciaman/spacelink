import { motion } from 'framer-motion';
import { Star, Check } from 'lucide-react';
import ChannelCard from './ChannelCard';
import type { PricingTier, PrimeFeature } from './types';

const channels: PricingTier[] = [
  {
    name: "AlienSales",
    description: "#1 Online shopping channel in Italy",
    url: "https://t.me/+rxNKXCHebOQxMGNk",
    price: 68,
    bundles: [
      { posts: 3, price: 150, savings: 54 },
      { posts: 5, price: 250, savings: 90 }
    ]
  },
  {
    name: "SpaceCoupon",
    description: "More than 130,000 members",
    url: "https://t.me/+he_qviXVbjYzYTE0",
    price: 27,
    bundles: [
      { posts: 3, price: 58, savings: 23 },
      { posts: 5, price: 94, savings: 41 }
    ]
  },
  {
    name: "CosmoTech",
    description: "Only tech & electronics deals",
    url: "https://t.me/+kuVqkdUPS545ZDM8",
    price: 15,
    bundles: [
      { posts: 3, price: 33, savings: 12 },
      { posts: 5, price: 54, savings: 21 }
    ]
  },
  {
    name: "Abbigliamento Spaziale",
    description: "Only style and clothes deals",
    url: "https://t.me/+O4jxj6D55fwzZGM0",
    price: 12,
    bundles: [
      { posts: 3, price: 27, savings: 9 },
      { posts: 5, price: 42, savings: 18 }
    ]
  },
  {
    name: "AstroHouse",
    description: "Only house furniture & accessories deals",
    url: "https://t.me/+bVFMYKRCsRA5MzM0",
    price: 10,
    bundles: [
      { posts: 3, price: 22, savings: 8 },
      { posts: 5, price: 36, savings: 14 }
    ]
  }
];

const primeFeatures: PrimeFeature[] = [
  {
    title: "Bundle Access",
    description: "Access to cost-saving bundle packages",
    standard: "Single post packages only",
    prime: "Up to 30% savings with bundles"
  },
  {
    title: "Booking Window",
    description: "How far in advance you can book",
    standard: "2 days in advance",
    prime: "30 days in advance"
  },
  {
    title: "Time Slots",
    description: "Control over posting times",
    standard: "First available slot",
    prime: "Choose your preferred time"
  },
  {
    title: "Priority Access",
    description: "Slot availability during peak times",
    standard: "Standard queue",
    prime: "Priority booking"
  }
];

export default function PricingSection() {
  return (
    <div className="bg-gradient-to-b from-blue-50 to-white py-24 sm:py-32" id="pricing">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Prime Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-20"
        >
          <div className="text-center">
            <Star className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              SpaceLink Prime
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Unlock premium features and save up to 30% on your posts
            </p>
          </div>

          <div className="mt-12 bg-white rounded-2xl shadow-xl overflow-hidden lg:grid lg:grid-cols-2 lg:gap-0">
            <div className="px-6 py-8 sm:p-10 lg:border-r lg:border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-semibold text-gray-900">Standard</h3>
                <span className="px-3 py-1 text-sm text-gray-500 border border-gray-200 rounded-full">
                  Free
                </span>
              </div>
              <ul className="mt-8 space-y-4">
                {primeFeatures.map(feature => (
                  <li key={feature.title} className="flex items-start">
                    <div className="flex-shrink-0">
                      <Check className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{feature.title}</p>
                      <p className="text-sm text-gray-500">{feature.standard}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="px-6 py-8 sm:p-10 bg-gradient-to-br from-blue-50 to-indigo-50">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-semibold text-gray-900">Prime</h3>
                <div className="flex flex-col items-end">
                  <span className="text-4xl font-bold text-gray-900">€48</span>
                  <span className="text-sm text-gray-500">/month</span>
                </div>
              </div>
              <ul className="mt-8 space-y-4">
                {primeFeatures.map(feature => (
                  <li key={feature.title} className="flex items-start">
                    <div className="flex-shrink-0">
                      <Check className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{feature.title}</p>
                      <p className="text-sm text-blue-600">{feature.prime}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Channels Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-4xl text-center"
        >
          <h2 className="text-base font-semibold leading-7 text-blue-600">Channels</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Choose your audience
          </p>
        </motion.div>

        <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-2 xl:grid-cols-3">
          {channels.map((channel, index) => (
            <ChannelCard key={channel.name} channel={channel} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}