import { useState, useCallback } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { BlockedDate, TimeInterval } from './types';
import TimeIntervalInput from './TimeIntervalInput';
import BlockedDatesList from './BlockedDatesList';
import { validateTimeInterval, checkIntervalsOverlap } from '../../../lib/utils/timeIntervals';

// Available time slots (24 hours)
const TIME_OPTIONS = [
  '00:00', '00:30', '01:00', '01:30', '02:00', '02:30',
  '03:00', '03:30', '04:00', '04:30', '05:00', '05:30',
  '06:00', '06:30', '07:00', '07:30', '08:00', '08:30',
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30', '20:00', '20:30',
  '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'
];

interface Props {
  initialSettings?: any;
  onSave: (settings: any) => Promise<void>;
}

export default function AvailabilitySettings({ initialSettings, onSave }: Props) {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [reason, setReason] = useState('Unavailable');
  const [intervals, setIntervals] = useState<TimeInterval[]>([]);
  const [intervalErrors, setIntervalErrors] = useState<Record<number, string | null>>({});
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>(
    (initialSettings?.blocked_dates || []).map((block: any) => ({
      ...block,
      date: new Date(block.date)
    }))
  );

  const handleAddInterval = useCallback(() => {
    setIntervals(prev => [...prev, { startTime: '', endTime: '' }]);
  }, []);

  const handleRemoveInterval = useCallback((index: number) => {
    setIntervals(prev => prev.filter((_, i) => i !== index));
    setIntervalErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[index];
      return newErrors;
    });
  }, []);

  const handleIntervalChange = useCallback((index: number, interval: TimeInterval) => {
    setIntervals(prev => {
      const newIntervals = [...prev];
      newIntervals[index] = interval;
      return newIntervals;
    });

    const singleError = validateTimeInterval(interval.startTime, interval.endTime);
    if (singleError) {
      setIntervalErrors(prev => ({ ...prev, [index]: singleError }));
      return;
    }

    const currentIntervals = intervals.map((int, i) => 
      i === index ? interval : int
    );
    const overlapErrors = checkIntervalsOverlap(currentIntervals);
    setIntervalErrors(overlapErrors);
  }, [intervals]);

  const handleAddBlock = useCallback(async () => {
    if (!selectedDate) return;
    
    // Check if date is already blocked
    if (blockedDates.some(block => 
      block.date.toDateString() === selectedDate.toDateString()
    )) {
      return;
    }

    // Check if there are any errors
    if (Object.values(intervalErrors).some(error => error !== null)) {
      return;
    }

    const newBlockedDates = [
      ...blockedDates,
      {
        date: selectedDate,
        intervals: [...intervals],
        reason
      }
    ];

    // Save to database
    await onSave({ blocked_dates: newBlockedDates.map(block => ({
      ...block,
      date: block.date.toISOString() // Convert Date to ISO string for storage
    }))});
    
    // Update local state
    setBlockedDates(newBlockedDates);
    
    // Reset form
    setSelectedDate(undefined);
    setIntervals([]);
    setIntervalErrors({});
    setReason('Unavailable');
  }, [selectedDate, intervals, reason, blockedDates, intervalErrors, onSave]);

  const handleRemoveBlock = useCallback(async (dateToRemove: Date) => {
    const newBlockedDates = blockedDates.filter(block => 
      block.date.toDateString() !== dateToRemove.toDateString()
    );

    // Save to database
    await onSave({ blocked_dates: newBlockedDates.map(block => ({
      ...block,
      date: block.date.toISOString() // Convert Date to ISO string for storage
    }))});
    
    // Update local state
    setBlockedDates(newBlockedDates);
  }, [blockedDates, onSave]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Channel Availability</h3>
        <p className="mt-1 text-sm text-gray-500">
          Manage dates when your channel will be unavailable for booking
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Calendar Section */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5 text-gray-500" />
            <h4 className="text-sm font-medium text-gray-900">Select Dates</h4>
          </div>
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            disabled={{ before: new Date() }}
            className="border-t border-gray-200 pt-4"
          />
        </div>

        {/* Block Form */}
        <div className="space-y-4">
          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
              Reason for Blocking
            </label>
            <input
              type="text"
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="e.g., Holiday, Maintenance"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-900">Time Intervals</h4>
              <button
                type="button"
                onClick={handleAddInterval}
                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500"
              >
                <Clock className="h-4 w-4 mr-1" />
                Add Interval
              </button>
            </div>

            {intervals.map((interval, index) => (
              <TimeIntervalInput
                key={index}
                interval={interval}
                index={index}
                error={intervalErrors[index]}
                onChange={handleIntervalChange}
                onRemove={handleRemoveInterval}
                timeOptions={TIME_OPTIONS}
              />
            ))}
          </div>

          <button
            onClick={handleAddBlock}
            disabled={!selectedDate || Object.values(intervalErrors).some(error => error !== null)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Block
          </button>

          {/* Blocked Dates List */}
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-900 mb-4">Blocked Dates</h4>
            <BlockedDatesList
              blockedDates={blockedDates}
              onRemove={handleRemoveBlock}
            />
          </div>
        </div>
      </div>
    </div>
  );
}