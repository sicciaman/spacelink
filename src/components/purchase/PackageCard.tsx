import { motion } from 'framer-motion';
import { Package as PackageIcon, Lock } from 'lucide-react';
import type { Package } from '../../lib/types';
import { cn } from '../../lib/utils/styles';

interface Props {
  pkg: Package;
  isSelected: boolean;
  onSelect: (packageId: string) => void;
  hasValidPeriod: boolean;
}

export default function PackageCard({ pkg, isSelected, onSelect, hasValidPeriod }: Props) {
  const isLocked = pkg.requires_subscription && !hasValidPeriod;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative rounded-lg border p-6 transition-all duration-200",
        isSelected ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-200",
        isLocked ? "opacity-75" : "hover:border-gray-300",
      )}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{pkg.name}</h3>
          <p className="text-sm text-gray-500">{pkg.post_count} posts</p>
        </div>
        <PackageIcon className={cn(
          "h-6 w-6",
          isSelected ? "text-blue-500" : "text-gray-400"
        )} />
      </div>

      <div className="mt-4">
        <p className="text-2xl font-bold text-gray-900">€{pkg.price}</p>
        {pkg?.savings && pkg.savings > 0 && (
          <p className="text-sm text-green-600">Save €{pkg.savings}</p>
        )}
      </div>

      {isLocked ? (
        <div className="mt-6">
          <div className="flex items-center text-sm text-gray-500">
            <Lock className="h-4 w-4 mr-2" />
            <span>Requires SpaceLink Prime</span>
          </div>
        </div>
      ) : (
        <button
          onClick={() => onSelect(pkg.id)}
          className={cn(
            "mt-6 w-full rounded-md px-3 py-2 text-sm font-medium",
            isSelected
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-100 text-gray-900 hover:bg-gray-200"
          )}
        >
          Select Package
        </button>
      )}
    </motion.div>
  );
}