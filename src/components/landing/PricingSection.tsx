import { motion } from 'framer-motion';
import ChannelCard from './ChannelCard';
import type { PricingTier } from './types';

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

export default function PricingSection() {
  return (
    <div className="bg-gradient-to-b from-blue-50 to-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-4xl text-center"
        >
          <h2 className="text-base font-semibold leading-7 text-blue-600">Pricing</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Choose your channel
          </p>
        </motion.div>

        <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-2 xl:grid-cols-4">
          {channels.map((channel, index) => (
            <ChannelCard key={channel.name} channel={channel} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}