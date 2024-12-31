import { Users } from 'lucide-react';
import EmptyState from '../EmptyState';

export default function EmptyCustomers() {
  return (
    <EmptyState
      icon={Users}
      title="No Customers Found"
      description="There are currently no registered customers in the system."
    />
  );
}