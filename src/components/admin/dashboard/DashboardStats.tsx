import { motion } from 'framer-motion';
import { Users, Package, Star, TrendingUp } from 'lucide-react';
import { useAdminStats } from '../../../hooks/useAdminStats';
import { TimeInterval } from '../../../hooks/useProfileStats';
import { cn } from '../../../lib/utils/styles';

interface Props {
  timeInterval: TimeInterval;
  onIntervalChange: (interval: TimeInterval) => void;
}

const intervals: { value: TimeInterval; label: string }[] = [
  { value: '30days', label: 'Last 30 Days' },
  { value: '90days', label: 'Last 90 Days' },
  { value: '6months', label: 'Last 6 Months' },
  { value: '12months', label: 'Last 12 Months' },
  { value: 'all', label: 'All Time' }
];

export default function DashboardStats({ timeInterval, onIntervalChange }: Props) {
  const { data: stats, isLoading } = useAdminStats(timeInterval);

  if (isLoading) return <div>Loading stats...</div>;

  const metrics = [
    {
      name: 'Total Customers',
      value: stats?.totalCustomers || 0,
      change: stats?.customerGrowth || 0,
      icon: Users,
      description: 'Active registered users'
    },
    {
      name: 'Total Revenue',
      value: `€${(stats?.totalRevenue || 0).toFixed(2)}`,
      change: stats?.revenueGrowth || 0,
      icon: TrendingUp,
      description: 'Total earnings from packages'
    },
    {
      name: 'Active Subscribers',
      value: stats?.activeSubscribers || 0,
      change: stats?.subscriberGrowth || 0,
      icon: Star,
      description: 'Current Prime members'
    },
    {
      name: 'Posts Booked',
      value: stats?.totalPosts || 0,
      change: stats?.postGrowth || 0,
      icon: Package,
      description: 'Total posts scheduled'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Overview</h2>
        <div className="flex space-x-2">
          {intervals.map(interval => (
            <button
              key={interval.value}
              onClick={() => onIntervalChange(interval.value)}
              className={cn(
                "px-3 py-1 text-sm rounded-md",
                timeInterval === interval.value
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              {interval.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          const isPositive = metric.change >= 0;

          return (
            <motion.div
              key={metric.name}
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
                        {metric.name}
                      </dt>
                      <dd className="mt-1">
                        <div className="text-2xl font-semibold text-gray-900">
                          {metric.value}
                        </div>
                        <div className="flex items-baseline">
                          <div className={cn(
                            "text-sm font-semibold",
                            isPositive ? "text-green-600" : "text-red-600"
                          )}>
                            {isPositive ? '+' : ''}{metric.change}%
                          </div>
                          <div className="ml-2 text-sm text-gray-500">
                            vs previous period
                          </div>
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