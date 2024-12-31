import { motion } from 'framer-motion';
import { Package, Calendar, Clock, Ban, PiggyBank, Wallet } from 'lucide-react';
import { TimeInterval } from '../../hooks/useProfileStats';
import { cn } from '../../lib/utils/styles';

interface Props {
  totalPosts: number;
  completedPosts: number;
  upcomingPosts: number;
  cancelledPosts: number;
  totalSpent: number;
  bundleSavings: number;
  onIntervalChange: (interval: TimeInterval) => void;
  selectedInterval: TimeInterval;
}

const intervals: { value: TimeInterval; label: string }[] = [
  { value: '30days', label: 'Last 30 Days' },
  { value: '90days', label: 'Last 90 Days' },
  { value: '6months', label: 'Last 6 Months' },
  { value: '12months', label: 'Last 12 Months' },
  { value: 'all', label: 'All Time' }
];

export default function ProfileStats({
  totalPosts = 0,
  completedPosts = 0,
  upcomingPosts = 0,
  cancelledPosts = 0,
  totalSpent = 0,
  bundleSavings = 0,
  onIntervalChange,
  selectedInterval
}: Props) {
  const stats = [
    { 
      name: 'Total Posts', 
      value: totalPosts.toString(), 
      icon: Package,
      description: 'Total posts booked'
    },
    { 
      name: 'Completed', 
      value: completedPosts.toString(), 
      icon: Calendar,
      description: 'Successfully published posts'
    },
    { 
      name: 'Upcoming', 
      value: upcomingPosts.toString(), 
      icon: Clock,
      description: 'Scheduled future posts'
    },
    { 
      name: 'Total Spent', 
      value: `€${totalSpent.toFixed(2)}`, 
      icon: Wallet,
      description: 'Total amount invested'
    },
    { 
      name: 'Bundle Savings', 
      value: `€${bundleSavings.toFixed(2)}`, 
      icon: PiggyBank,
      description: 'Saved with bundle packages vs. single posts'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Statistics</h2>
        <div className="flex space-x-2">
          {intervals.map(interval => (
            <button
              key={interval.value}
              onClick={() => onIntervalChange(interval.value)}
              className={cn(
                "px-3 py-1 text-sm rounded-md",
                selectedInterval === interval.value
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              {interval.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white overflow-hidden shadow rounded-lg"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Icon className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.name}
                      </dt>
                      <dd className="mt-1">
                        <div className="text-2xl font-semibold text-gray-900">
                          {stat.value}
                        </div>
                        <div className="text-sm text-gray-500">
                          {stat.description}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}