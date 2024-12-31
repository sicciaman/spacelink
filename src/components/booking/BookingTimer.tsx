import { Clock } from 'lucide-react';
import CountdownTimer from '../common/CountdownTimer';

interface Props {
  expiresAt: Date;
  onExpire: () => void;
}

export default function BookingTimer({ expiresAt, onExpire }: Props) {
  return (
    <div className="bg-white shadow-lg rounded-lg p-4 flex items-center space-x-3 border border-gray-200">
      <div className="flex items-center text-gray-600">
        <Clock className="w-4 h-4 mr-2" />
        <span className="text-sm">Time slot reserved for:</span>
      </div>
      <CountdownTimer 
        expiresAt={expiresAt} 
        onExpire={onExpire}
        className="text-gray-900 font-medium" 
      />
    </div>
  );
}