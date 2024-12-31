import Skeleton from '../common/Skeleton';

export default function PackageCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-start">
        <div>
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-5 w-24 rounded-full" />
      </div>
      <Skeleton className="mt-4 h-5 w-40" />
      <Skeleton className="mt-2 h-4 w-36" />
      <Skeleton className="mt-4 h-5 w-24" />
    </div>
  );
}