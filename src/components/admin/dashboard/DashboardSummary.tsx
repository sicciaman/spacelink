import { motion } from 'framer-motion';
import { Calendar, Package, Star } from 'lucide-react';
import { useAdminSummary } from '../../../hooks/useAdminSummary';
import { TimeInterval } from '../../../hooks/useProfileStats';
import { format } from 'date-fns';

interface Props {
  timeInterval: TimeInterval;
}

const iconMap = {
  calendar: Calendar,
  package: Package,
  star: Star
};

export default function DashboardSummary({ timeInterval }: Props) {
  const { data, isLoading } = useAdminSummary(timeInterval);

  if (isLoading) return <div>Loading summary...</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow p-6"
    >
      <h3 className="text-lg font-medium text-gray-900 mb-6">Recent Activity</h3>

      <div className="flow-root">
        <ul className="-mb-8">
          {data?.recentActivity.map((activity, index) => {
            const Icon = iconMap[activity.iconType];
            
            return (
              <li key={activity.id}>
                <div className="relative pb-8">
                  {index !== data.recentActivity.length - 1 && (
                    <span
                      className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                      aria-hidden="true"
                    />
                  )}
                  <div className="relative flex space-x-3">
                    <div>
                      <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                        activity.type === 'booking' ? 'bg-blue-500' :
                        activity.type === 'purchase' ? 'bg-green-500' :
                        'bg-yellow-500'
                      }`}>
                        <Icon className="h-5 w-5 text-white" />
                      </span>
                    </div>
                    <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                      <div>
                        <p className="text-sm text-gray-500">
                          {activity.description}
                        </p>
                      </div>
                      <div className="whitespace-nowrap text-right text-sm text-gray-500">
                        {format(new Date(activity.timestamp), 'PP')}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </motion.div>
  );
}