import { useChannels } from '../../hooks/useChannels';
import ChannelList from '../channels/ChannelList';
import type { EnhancedChannel } from '../channels/types';

interface Props {
  selectedChannel: string | null;
  onSelect: (channelId: string) => void;
}

export default function ChannelSelector({ selectedChannel, onSelect }: Props) {
  const { data: channels, isLoading } = useChannels();

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-10 bg-gray-200 rounded w-48"></div>
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-32 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  // Transform backend data to enhanced format
  const enhancedChannels: EnhancedChannel[] = channels?.map(channel => ({
    id: channel.id,
    name: channel.name,
    description: channel.description,
    logoUrl: channel.logo_url || '',
    telegramUrl: channel.telegram_url,
    type: channel.type as 'main' | 'specialized',
    featured: channel.featured,
    stats: {
      memberCount: channel.stats?.member_count || 0,
      avgViews24h: channel.stats?.avg_views_24h || 0,
      engagementRate: channel.stats?.engagement_rate || 0
    },
    tags: channel.tags?.map(tag => ({
      id: tag.id,
      name: tag.name,
      color: tag.color
    })) || [],
    badges: channel.badges?.map(badge => ({
      type: badge.type,
      label: badge.label
    }))
  })) || [];

  return (
    <section>
      <h2 className="text-lg font-medium text-gray-900 mb-6">Select a Channel</h2>
      <ChannelList
        channels={enhancedChannels}
        selectedChannel={selectedChannel}
        onSelect={onSelect}
      />
    </section>
  );
}