import { BookingStatus } from '../../lib/types';
import { statusColors } from '../../lib/utils/styles';

interface Props {
  selectedStatus: BookingStatus;
  onChange: (status: BookingStatus) => void;
}

const statuses: BookingStatus[] = ['pending', 'completed', 'cancelled'];

export default function BookingStatusFilter({ selectedStatus, onChange }: Props) {
  return (
    <div className="flex space-x-2">
      {statuses.map((status) => (
        <button
          key={status}
          onClick={() => onChange(status)}
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            selectedStatus === status
              ? statusColors[status]
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </button>
      ))}
    </div>
  );
}