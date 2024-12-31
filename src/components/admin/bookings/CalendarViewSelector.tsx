import { Calendar as CalendarIcon, Clock, CalendarDays } from 'lucide-react';
import { cn } from '../../../lib/utils/styles';

export type CalendarView = 'day' | 'week' | 'month';

interface Props {
  view: CalendarView;
  onChange: (view: CalendarView) => void;
}

const views: { id: CalendarView; label: string; icon: typeof CalendarIcon }[] = [
  { id: 'day', label: 'Day', icon: Clock },
  { id: 'week', label: 'Week', icon: CalendarDays },
  { id: 'month', label: 'Month', icon: CalendarIcon }
];

export default function CalendarViewSelector({ view, onChange }: Props) {
  return (
    <div className="flex space-x-2">
      {views.map((option) => {
        const Icon = option.icon;
        return (
          <button
            key={option.id}
            onClick={() => onChange(option.id)}
            className={cn(
              'inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors',
              view === option.id
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100'
            )}
          >
            <Icon className="w-4 h-4 mr-2" />
            {option.label}
          </button>
        );
      })}
    </div>
  );
}