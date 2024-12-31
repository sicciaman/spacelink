import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useProfileStats, TimeInterval } from '../hooks/useProfileStats';
import SubscriptionManager from '../components/profile/SubscriptionManager';
import ProfileDetails from '../components/profile/ProfileDetails';
import ProfileStats from '../components/profile/ProfileStats';

export default function Profile() {
  const { user } = useAuth();
  const [timeInterval, setTimeInterval] = useState<TimeInterval>('30days');
  const { data: stats, isLoading } = useProfileStats(timeInterval);

  if (!user) return null;

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>

      <ProfileStats
        totalPosts={stats?.totalPosts ?? 0}
        completedPosts={stats?.completedPosts ?? 0}
        upcomingPosts={stats?.upcomingPosts ?? 0}
        cancelledPosts={stats?.cancelledPosts ?? 0}
        totalSpent={stats?.totalSpent ?? 0}
        bundleSavings={stats?.bundleSavings ?? 0}
        subscriptionSavings={stats?.subscriptionSavings ?? 0}
        onIntervalChange={setTimeInterval}
        selectedInterval={timeInterval}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ProfileDetails />
        </div>
        
        <div className="lg:col-span-1">
          <SubscriptionManager />
        </div>
      </div>
    </div>
  );
}