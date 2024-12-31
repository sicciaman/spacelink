import { useChannels } from '../../hooks/useChannels';
import { cn } from '../../lib/utils/styles';

const CHANNEL_ORDER = [
  'AlienSales',
  'SpaceCoupon',
  'CosmoTech',
  'AstroHouse',
  'Abbigliamento Spaziale'
];

interface Props {
  selectedChannel: string | null;
  onChange: (channelId: string | null) => void;
  className?: string;
}

export default function ChannelFilter({ selectedChannel, onChange, className }: Props) {
  const { data: channels = [], isLoading } = useChannels();

  if (isLoading) return null;

  // Sort channels according to the specified order
  const sortedChannels = [...channels].sort((a, b) => {
    const indexA = CHANNEL_ORDER.indexOf(a.name);
    const indexB = CHANNEL_ORDER.indexOf(b.name);
    return indexA - indexB;
  });

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {sortedChannels.map((channel) => (
        <button
          key={channel.id}
          onClick={() => onChange(selectedChannel === channel.id ? null : channel.id)}
          className={cn(
            "px-3 py-1.5 text-sm font-medium rounded-full",
            selectedChannel === channel.id
              ? "bg-blue-100 text-blue-700"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          )}
        >
          {channel.name}
        </button>
      ))}
    </div>
  );
}