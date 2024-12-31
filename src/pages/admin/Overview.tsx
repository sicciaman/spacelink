import { useState } from 'react';
import DashboardStats from '../../components/admin/dashboard/DashboardStats';
import DashboardCharts from '../../components/admin/dashboard/DashboardCharts';
import DashboardSummary from '../../components/admin/dashboard/DashboardSummary';
import { TimeInterval } from '../../hooks/useProfileStats';

export default function Overview() {
  const [timeInterval, setTimeInterval] = useState<TimeInterval>('30days');

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>

      <DashboardStats 
        timeInterval={timeInterval}
        onIntervalChange={setTimeInterval}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <DashboardCharts timeInterval={timeInterval} />
        <DashboardSummary timeInterval={timeInterval} />
      </div>
    </div>
  );
}