import { Link } from 'react-router-dom';
import { Globe, Users, Clock, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import StatsCard from './StatsCard';
import GrowthChart from './GrowthChart';

const stats = [
  { name: 'Active Members', value: '730K+', icon: Users },
  { name: 'Posts per Year', value: '8.7K+', icon: Clock },
  { name: 'Success Rate', value: '99%', icon: CheckCircle },
];

export default function HeroSection() {
  return (
    <div className="relative isolate overflow-hidden bg-gradient-to-b from-blue-100/20">
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
        <div className="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-24 sm:mt-32 lg:mt-16"
          >
            <span className="rounded-full bg-blue-600/10 px-3 py-1 text-sm font-semibold leading-6 text-blue-600 ring-1 ring-inset ring-blue-600/10">
              Connect & Grow
            </span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl"
          >
            Your Bridge to Italy's Largest Deal Communities
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-6 text-lg leading-8 text-gray-600"
          >
            SpaceLink connects brands with Italy's most engaged deal-seeking audiences. 
            Reach over 730,000 active members across our premium Telegram channels.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-10 flex items-center gap-x-6"
          >
            <Link
              to="/login"
              className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Start Connecting
            </Link>
            <a href="#pricing" className="text-sm font-semibold leading-6 text-gray-900">
              View Channels <span aria-hidden="true">→</span>
            </a>
          </motion.div>
        </div>

        <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none xl:ml-32">
          <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
            <GrowthChart />
          </div>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-7xl px-6 sm:mt-16 lg:px-8">
        <dl className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-10 text-white sm:grid-cols-2 sm:gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {stats.map((stat, index) => (
            <StatsCard
              key={stat.name}
              icon={stat.icon}
              label={stat.name}
              value={stat.value}
              delay={0.1 * index}
            />
          ))}
        </dl>
      </div>
    </div>
  );
}