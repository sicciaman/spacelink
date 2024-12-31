import { useState } from 'react';
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, addDays, addWeeks, addMonths } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import BookingDetailsPanel from './BookingDetailsPanel';
import CalendarViewSelector, { CalendarView } from './CalendarViewSelector';
import ChannelFilter from '../../common/ChannelFilter';
import DayView from './calendar/DayView';
import WeekView from './calendar/WeekView';
import MonthView from './calendar/MonthView';
import { useAdminCalendarBookings } from '../../../hooks/useAdminCalendarBookings';

export default function AdminBookingsCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [view, setView] = useState<CalendarView>('week');
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);

  // Calculate date range based on view
  const getDateRange = () => {
    const date = startOfDay(currentDate);
    
    switch (view) {
      case 'day':
        return {
          start: startOfDay(date),
          end: endOfDay(date)
        };
      case 'week':
        return {
          start: startOfWeek(date, { weekStartsOn: 1 }),
          end: endOfWeek(date, { weekStartsOn: 1 })
        };
      case 'month':
        return {
          start: startOfMonth(date),
          end: endOfMonth(date)
        };
    }
  };

  const { start, end } = getDateRange();

  const { data: bookings = [], isLoading } = useAdminCalendarBookings(start, end, selectedChannel);

  const handleNavigate = (direction: 'prev' | 'next') => {
    setCurrentDate(prevDate => {
      const date = new Date(prevDate);
      
      switch (view) {
        case 'day':
          return direction === 'prev' ? addDays(date, -1) : addDays(date, 1);
        case 'week':
          return direction === 'prev' ? addWeeks(date, -1) : addWeeks(date, 1);
        case 'month':
          return direction === 'prev' ? addMonths(date, -1) : addMonths(date, 1);
        default:
          return date;
      }
    });
  };

  const handleViewChange = (newView: CalendarView) => {
    setView(newView);
    setCurrentDate(prevDate => {
      const date = new Date(prevDate);
      switch (newView) {
        case 'day':
          return startOfDay(date);
        case 'week':
          return startOfWeek(date, { weekStartsOn: 1 });
        case 'month':
          return startOfMonth(date);
        default:
          return date;
      }
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const renderCalendarView = () => {
    const props = {
      currentDate,
      bookings,
      onBookingSelect: setSelectedBooking
    };

    switch (view) {
      case 'day':
        return <DayView {...props} />;
      case 'week':
        return <WeekView {...props} />;
      case 'month':
        return <MonthView {...props} />;
    }
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="flex flex-col gap-4 px-6 py-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleNavigate('prev')}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-semibold">
              {format(currentDate, view === 'day' ? 'PP' : 'MMMM yyyy')}
            </h2>
            <button
              onClick={() => handleNavigate('next')}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <CalendarViewSelector view={view} onChange={handleViewChange} />
        </div>

        <ChannelFilter
          selectedChannel={selectedChannel}
          onChange={setSelectedChannel}
        />
      </div>

      {renderCalendarView()}

      {selectedBooking && (
        <BookingDetailsPanel
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      )}
    </div>
  );
}