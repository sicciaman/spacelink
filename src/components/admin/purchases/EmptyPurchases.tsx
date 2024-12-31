import { Package } from 'lucide-react';
import EmptyState from '../EmptyState';

export default function EmptyPurchases() {
  return (
    <EmptyState
      icon={Package}
      title="No Purchases Found"
      description="No packages have been purchased yet."
    />
  );
}