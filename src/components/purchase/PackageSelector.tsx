import { usePackageAccess } from '../../hooks/usePackageAccess';
import { usePackages } from '../../hooks/usePackages';
import PackageCard from './PackageCard';
import SubscriptionPrompt from './SubscriptionPrompt';
import type { Package } from '../../lib/types';

interface Props {
  channelId: string | null;
  selectedPackage: string | null;
  onSelect: (packageId: string) => void;
}

export default function PackageSelector({ channelId, selectedPackage, onSelect }: Props) {
  const { data: packages, isLoading } = usePackages(channelId);
  const { isSubscribed, isCancelled } = usePackageAccess();

  if (isLoading) {
    return <div>Loading packages...</div>;
  }

  // Show subscription prompt if:
  // 1. User has no active subscription OR
  // 2. User has a cancelled subscription that's still valid
  const showSubscriptionPrompt = (!isSubscribed) || isCancelled;

  return (
    <section>
      <h2 className="text-lg font-medium text-gray-900 mb-4">Select a Package</h2>
      
      {showSubscriptionPrompt && <SubscriptionPrompt />}

      <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 ${showSubscriptionPrompt ? 'mt-6' : ''}`}>
        {packages?.map((pkg: Package) => (
          <PackageCard
            key={pkg.id}
            pkg={pkg}
            isSelected={selectedPackage === pkg.id}
            onSelect={onSelect}
            isSubscribed={!!isSubscribed}
          />
        ))}
      </div>
    </section>
  );
}