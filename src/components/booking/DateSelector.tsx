import { DayPicker } from 'react-day-picker';
import { addDays } from 'date-fns';
import TimeSlotSelector from './TimeSlotSelector';
import { useSubscription } from '../../hooks/useSubscription';
import { Crown } from 'lucide-react';
import PrimeModal from '../subscription/PrimeModal';
import { useState } from 'react';
import 'react-day-picker/dist/style.css';

interface Props {
  channelId: string | null;
  selectedDate: Date | null;
  selectedTime: string | null;
  onSelect: (date: Date | null, time: string | null) => void;
  onContinue: () => void;
}

export default function DateSelector({ 
  channelId, 
  selectedDate, 
  selectedTime, 
  onSelect,
  onContinue
}: Props) {
  const { hasValidPeriod, getMaxBookingDays } = useSubscription();
  const [showPrimeModal, setShowPrimeModal] = useState(false);
  
  // Get max booking days based on subscription status
  const maxDays = getMaxBookingDays();
  const maxDate = addDays(new Date(), maxDays);

  return (
    <section>
      {!hasValidPeriod && (
        <div className="mb-6 bg-gradient-to-r from-amber-50 to-yellow-50 border border-yellow-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Crown className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Upgrade to Prime for More Flexibility
                </h3>
                <div className="mt-1 text-sm text-yellow-700">
                  <p>Choose your preferred time slots and book up to 30 days in advance</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowPrimeModal(true)}
              className="flex-shrink-0 ml-4 px-3 py-1.5 text-sm font-medium rounded-md text-yellow-800 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              Learn More
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:space-x-8">
        <div className="flex-shrink-0">
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={(date) => onSelect(date, selectedTime)}
            disabled={{ 
              before: new Date(),
              after: maxDate 
            }}
            modifiers={{ 
              available: { 
                after: new Date(), 
                before: maxDate 
              } 
            }}
            weekStartsOn={1}
            className="bg-white p-3 rounded-lg shadow-sm border border-gray-200"
          />
        </div>
        <div className="flex-1 mt-6 md:mt-0">
          <TimeSlotSelector
            channelId={channelId}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onSelect={(time) => onSelect(selectedDate, time)}
          />
          
          {selectedDate && selectedTime && (
            <div className="mt-6">
              <button
                onClick={onContinue}
                className="w-full bg-blue-600 text-white rounded-lg py-2.5 px-4 hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center font-medium"
              >
                Continue to Deal Information
              </button>
            </div>
          )}
        </div>
      </div>

      <PrimeModal 
        isOpen={showPrimeModal}
        onClose={() => setShowPrimeModal(false)}
      />
    </section>
  );
}