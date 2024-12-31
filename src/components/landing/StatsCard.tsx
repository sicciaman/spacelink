import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  delay: number;
}

export default function StatsCard({ icon: Icon, label, value, delay }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="flex flex-col gap-y-3 border-l border-gray-200 pl-6"
    >
      <dt className="text-sm leading-6 text-gray-600 flex items-center">
        <Icon className="h-5 w-5 mr-2 text-blue-600" />
        {label}
      </dt>
      <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900">
        {value}
      </dd>
    </motion.div>
  );
}