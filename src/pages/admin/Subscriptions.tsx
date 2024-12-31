import { useState } from 'react';
import { useSubscriptions } from '../../hooks/useSubscriptions';
import SubscriptionList from '../../components/admin/subscriptions/SubscriptionList';
import SubscriptionStats from '../../components/admin/subscriptions/SubscriptionStats';
import { TimeInterval } from '../../hooks/useProfileStats';

export default function Subscriptions() {
  const [timeInterval, setTimeInterval] = useState<TimeInterval>('30days');
  const { data: subscriptions, isLoading } = useSubscriptions();

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Subscriptions</h1>

      <SubscriptionStats 
        timeInterval={timeInterval}
        onIntervalChange={setTimeInterval}
      />

      <SubscriptionList 
        subscriptions={subscriptions || []}
        isLoading={isLoading}
      />
    </div>
  );
}