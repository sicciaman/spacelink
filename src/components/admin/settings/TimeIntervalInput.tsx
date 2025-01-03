import { X } from 'lucide-react';
import { TimeInterval } from './types';

interface Props {
  interval: TimeInterval;
  index: number;
  error: string | null;
  onChange: (index: number, interval: TimeInterval) => void;
  onRemove: (index: number) => void;
  timeOptions: string[];
}

export default function TimeIntervalInput({ 
  interval, 
  index, 
  error,
  onChange, 
  onRemove,
  timeOptions 
}: Props) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-4">
        <div className="flex-1 grid grid-cols-2 gap-4">
          <div>
            <select
              value={interval.startTime}
              onChange={(e) => onChange(index, { ...interval, startTime: e.target.value })}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Start Time</option>
              {timeOptions.map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={interval.endTime}
              onChange={(e) => onChange(index, { ...interval, endTime: e.target.value })}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">End Time</option>
              {timeOptions.map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="p-1 text-gray-400 hover:text-red-500"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}