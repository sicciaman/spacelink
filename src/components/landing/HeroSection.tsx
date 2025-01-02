import { Link } from 'react-router-dom';
import { Globe, Users, MessageCircle, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import StatsCard from './StatsCard';

const stats = [
  { 
    name: 'Active Members',
    value: '730K+',
    icon: Users,
    description: 'Engaged community members'
  },
  { 
    name: 'Daily Messages',
    value: '25K+',
    icon: MessageCircle,
    description: 'Active daily interactions'
  },
  { 
    name: 'Conversion Rate',
    value: '12%',
    icon: TrendingUp,
    description: 'Average click-through rate'
  }
];

export default function HeroSection() {
  return (
    <div className="relative isolate overflow-hidden bg-gradient-to-b from-blue-50 via-white to-blue-50">
      <div className="absolute inset-x-0 top-0 -z-10 transform-gpu overflow-hidden blur-2xl">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-blue-200 to-blue-400 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
      </div>

      <div className="mx-auto max-w-7xl px-6 pt-16 sm:pt-24 lg:pt-32">
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center rounded-full bg-blue-100 px-4 py-1 text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
              <Globe className="mr-2 h-4 w-4" />
              Italy's #1 Deal Platform
            </span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl"
          >
            Connect Your Brand with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Millions of Shoppers
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-6 text-lg leading-8 text-gray-600"
          >
            SpaceLink bridges brands with Italy's most engaged deal-seeking communities. 
            Reach over 730,000 active members across our premium Telegram channels.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 flex items-center justify-center"
          >
            <Link
              to="/login"
              className="rounded-full bg-blue-600 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all duration-200"
            >
              Start Connecting
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mx-auto mt-16 max-w-7xl px-6 sm:mt-24 lg:px-8"
        >
          <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-3">
            {stats.map((stat, index) => (
              <StatsCard
                key={stat.name}
                icon={stat.icon}
                label={stat.name}
                value={stat.value}
                description={stat.description}
                delay={0.1 * index}
              />
            ))}
          </dl>
        </motion.div>
      </div>
    </div>
  );
}