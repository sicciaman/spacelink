import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  description: string;
  delay: number;
}

export default function StatsCard({ icon: Icon, label, value, description, delay }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="mx-auto flex max-w-xs flex-col gap-y-4"
    >
      <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-blue-100">
        <Icon className="h-8 w-8 text-blue-600" />
      </div>
      <dt className="text-base leading-7 text-gray-600">{label}</dt>
      <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
        {value}
      </dd>
      <p className="text-sm text-gray-500">{description}</p>
    </motion.div>
  );
}