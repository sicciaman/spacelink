import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Jan', members: 450000 },
  { month: 'Feb', members: 480000 },
  { month: 'Mar', members: 520000 },
  { month: 'Apr', members: 550000 },
  { month: 'May', members: 590000 },
  { month: 'Jun', members: 630000 },
  { month: 'Jul', members: 680000 },
  { month: 'Aug', members: 700000 },
  { month: 'Sep', members: 710000 },
  { month: 'Oct', members: 720000 },
  { month: 'Nov', members: 725000 },
  { month: 'Dec', members: 730000 },
];

export default function GrowthChart() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full h-[400px] bg-white rounded-lg shadow-lg p-4"
    >
      <h3 className="text-lg font-semibold mb-4">Community Growth</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="month"
            tick={{ fill: '#4B5563' }}
          />
          <YAxis
            tick={{ fill: '#4B5563' }}
            tickFormatter={(value) => `${value / 1000}k`}
          />
          <Tooltip
            formatter={(value: number) => [`${value.toLocaleString()} members`, 'Members']}
          />
          <Line 
            type="monotone" 
            dataKey="members" 
            stroke="#2563eb" 
            strokeWidth={2}
            dot={{ fill: '#2563eb', r: 4 }}
            activeDot={{ r: 8 }}
            isAnimationActive={true}
            animationDuration={2000}
            animationBegin={300}
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}