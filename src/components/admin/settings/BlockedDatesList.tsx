import { X } from 'lucide-react';
import { format } from 'date-fns';
import type { BlockedDate } from './types';

interface Props {
  blockedDates: BlockedDate[];
  onRemove: (date: Date) => void;
}

export default function BlockedDatesList({ blockedDates, onRemove }: Props) {
  return (
    <div className="space-y-2">
      {blockedDates.map((block) => {
        // Ensure date is a Date object
        const blockDate = block.date instanceof Date ? block.date : new Date(block.date);
        
        return (
          <div
            key={blockDate.toISOString()}
            className="flex items-start justify-between bg-gray-50 p-3 rounded-md"
          >
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-900">
                {format(blockDate, 'PPP')}
              </p>
              {block.intervals.length > 0 ? (
                <div className="space-y-1">
                  {block.intervals.map((interval, idx) => (
                    <p key={idx} className="text-sm text-gray-500">
                      {interval.startTime} - {interval.endTime}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">All Day</p>
              )}
              <p className="text-sm text-gray-500">{block.reason}</p>
            </div>
            <button
              onClick={() => onRemove(blockDate)}
              className="text-gray-400 hover:text-red-500"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}