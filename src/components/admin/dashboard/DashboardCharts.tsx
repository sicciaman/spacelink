import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useAdminChartData } from '../../../hooks/useAdminChartData';
import { TimeInterval } from '../../../hooks/useProfileStats';

interface Props {
  timeInterval: TimeInterval;
}

export default function DashboardCharts({ timeInterval }: Props) {
  const { data, isLoading } = useAdminChartData(timeInterval);

  if (isLoading) return <div>Loading charts...</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow p-6 space-y-8"
    >
      {/* Revenue Chart */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data?.revenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="amount" 
                stroke="#2563eb" 
                strokeWidth={2}
                dot={{ fill: '#2563eb', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Posts Distribution Chart */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Posts by Channel</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data?.postsByChannel}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="channel" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="posts" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}