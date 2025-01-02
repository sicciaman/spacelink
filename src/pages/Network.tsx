import { useState } from 'react';
import { useChannels } from '../hooks/useChannels';
import ChannelList from '../components/channels/ChannelList';
import type { EnhancedChannel } from '../components/channels/types';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

export default function Network() {
  const { data: channels, isLoading } = useChannels();
  const [searchQuery, setSearchQuery] = useState('');

  if (isLoading) {
    return <div>Loading...</div>;
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

  const filteredChannels = enhancedChannels.filter(channel => 
    channel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    channel.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Our Network</h1>
          <p className="mt-2 text-gray-600">
            Discover our premium Telegram channels and their performance metrics
          </p>
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search channels..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <ChannelList
            channels={filteredChannels}
            selectedChannel={null}
            onSelect={() => {}}
          />
        </div>
      </motion.div>
    </div>
  );
}