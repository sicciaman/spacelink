import { useSubscription } from './useSubscription';
import type { Package } from '../lib/types';

export function usePackageAccess() {
  const { subscription, isSubscribed, isCancelled } = useSubscription();

  const canPurchasePackage = (pkg: Package) => {
    // Single post packages are always available
    if (!pkg.requires_subscription) return true;
    
    // If there's no subscription, bundles are not available
    if (!subscription) return false;

    if (!isSubscribed) return false;
  };

  return {
    canPurchasePackage,
    isSubscribed,
    isCancelled
  };
}