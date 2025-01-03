import { format } from 'date-fns';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useChannels } from '../../hooks/useChannels';
import type { Package, Purchase } from '../../lib/types';
import { getDaysUntilExpiration, isPackageExpired } from '../../lib/utils/package';
import EmptyPackages from './EmptyPackages';
import PackageCardSkeleton from './PackageCardSkeleton';

const ITEMS_PER_PAGE = 6;
const SKELETON_COUNT = 3;

interface Props {
  packages: (Purchase & { packages: Package })[];
  isLoading?: boolean;
}

export default function PackageList({ packages, isLoading = false }: Props) {
  const [visibleItems, setVisibleItems] = useState(ITEMS_PER_PAGE);
  const { data: channels, isLoading: channelsLoading } = useChannels();
  const hasMore = visibleItems < packages.length;

  const getChannelName = (channelId: string) => {
    return channels?.find(channel => channel.id === channelId)?.name || '';
  };

  if (isLoading || channelsLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <PackageCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!packages?.length) {
    return <EmptyPackages />;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {packages.slice(0, visibleItems).map((purchase) => {
          const isExpired = isPackageExpired(purchase);
          const daysLeft = !isExpired ? getDaysUntilExpiration(purchase) : 0;

          return (
            <div
              key={purchase.id}
              className="bg-white rounded-lg shadow p-6"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{purchase.packages.name}</h3>
                  <p className="text-sm text-gray-500">
                    {getChannelName(purchase.packages.channel_id)}
                  </p>
                </div>
                {isExpired || purchase.posts_remaining === 0 ? (
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                    Expired
                  </span>
                ) : daysLeft <= 7 ? (
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                    {daysLeft === 0 ? 'Expires today' : `${daysLeft} days left`}
                  </span>
                ) : (
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                    Active
                  </span>
                )}
              </div>
              
              <p className="mt-4 text-gray-600">
                Posts remaining: {purchase.posts_remaining}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Purchased: {format(new Date(purchase.created_at), 'PP')}
              </p>
              
              {!isExpired && purchase.posts_remaining > 0 && (
                <Link
                  to={`/book/${purchase.id}`}
                  className="mt-4 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  Book a Post
                  <span className="ml-2">→</span>
                </Link>
              )}
            </div>
          );
        })}
      </div>
      
      {hasMore && (
        <div className="text-center">
          <button
            onClick={() => setVisibleItems(prev => prev + ITEMS_PER_PAGE)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Show More
          </button>
        </div>
      )}
    </div>
  );
}