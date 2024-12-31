import { Star } from 'lucide-react';
import EmptyState from '../EmptyState';

export default function EmptySubscriptions() {
  return (
    <EmptyState
      icon={Star}
      title="No Subscriptions Found"
      description="There are currently no Prime subscriptions in the system."
    />
  );
}