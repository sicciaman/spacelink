import { cn } from '../../lib/utils/styles';

interface Props {
  className?: string;
}

export default function Skeleton({ className }: Props) {
  return (
    <div className={cn('animate-pulse bg-gray-200 rounded', className)} />
  );
}