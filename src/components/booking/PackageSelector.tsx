import { usePackages } from '../../hooks/usePackages';
import type { Package } from '../../lib/types';

interface Props {
  channelId: string | null;
  selectedPackage: string | null;
  onSelect: (packageId: string) => void;
}

export default function PackageSelector({ channelId, selectedPackage, onSelect }: Props) {
  const { data: packages, isLoading } = usePackages(channelId);

  if (isLoading) return <div>Loading packages...</div>;

  return (
    <section>
      <h2 className="text-lg font-medium text-gray-900 mb-4">Select a Package</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {packages?.map((pkg: Package) => (
          <button
            key={pkg.id}
            onClick={() => onSelect(pkg.id)}
            className={`relative rounded-lg border p-4 flex flex-col
              ${selectedPackage === pkg.id ? 
                'border-blue-500 ring-2 ring-blue-200' : 
                'border-gray-300 hover:border-gray-400'}`}
          >
            <h3 className="text-sm font-medium text-gray-900">{pkg.name}</h3>
            <p className="mt-1 text-sm text-gray-500">{pkg.post_count} posts</p>
            <p className="mt-1 text-sm font-medium text-gray-900">€{pkg.price}</p>
            {pkg.savings > 0 && (
              <p className="mt-1 text-sm text-green-600">Save €{pkg.savings}</p>
            )}
          </button>
        ))}
      </div>
    </section>
  );
}