import { useState } from 'react';
import { CalendarDays, Table } from 'lucide-react';
import AdminBookingsTable from '../../components/admin/bookings/AdminBookingsTable';
import AdminBookingsCalendar from '../../components/admin/bookings/AdminBookingsCalendar';

type ViewMode = 'table' | 'calendar';

export default function Bookings() {
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Bookings</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode('table')}
            className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium ${
              viewMode === 'table'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Table className="w-4 h-4 mr-2" />
            Table
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium ${
              viewMode === 'calendar'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <CalendarDays className="w-4 h-4 mr-2" />
            Calendar
          </button>
        </div>
      </div>

      {viewMode === 'table' ? (
        <AdminBookingsTable />
      ) : (
        <AdminBookingsCalendar />
      )}
    </div>
  );
}