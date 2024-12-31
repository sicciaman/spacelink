import { useSubscription } from './useSubscription';
import type { Package } from '../lib/types';

export function usePackageAccess() {
  const { subscription } = useSubscription();

  const canPurchasePackage = (pkg: Package) => {
    // Single post packages are always available
    if (!pkg.requires_subscription) return true;
    
    // If there's no subscription, bundles are not available
    if (!subscription) return false;

    // Allow bundle purchases if subscription period is still valid,
    // regardless of subscription status (active or cancelled)
    const currentPeriodEnd = new Date(subscription.current_period_end);
    return currentPeriodEnd > new Date();
  };

  // Check if user has an active subscription
  const isSubscribed = subscription?.status === 'active';

  // Check if user has a valid subscription period (even if cancelled)
  const hasValidPeriod = subscription && 
    new Date(subscription.current_period_end) > new Date();

  // Check if subscription is cancelled but still valid
  const isCancelledButValid = subscription?.status === 'cancelled' && hasValidPeriod;

  return {
    canPurchasePackage,
    isSubscribed,
    hasValidPeriod,
    isCancelledButValid
  };
}