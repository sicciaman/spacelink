import { useState } from 'react';
import { motion } from 'framer-motion';
import type { EnhancedChannel } from './types';
import ChannelCard from './ChannelCard';

interface Props {
  channels: EnhancedChannel[];
  selectedChannel: string | null;
  onSelect: (channelId: string) => void;
}

export default function ChannelList({ channels, selectedChannel, onSelect }: Props) {
  const [filter, setFilter] = useState<'all' | 'main' | 'specialized'>('all');

  // Sort channels: featured first, then by member count
  const sortedChannels = [...channels].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return b.stats.memberCount - a.stats.memberCount;
  });

  const filteredChannels = sortedChannels.filter(channel => 
    filter === 'all' || channel.type === filter
  );

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex space-x-4">
        {[
          { id: 'all', label: 'All Channels' },
          { id: 'main', label: 'Main Channels' },
          { id: 'specialized', label: 'Specialized' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as typeof filter)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === tab.id
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Channel Grid */}
      <motion.div 
        className="grid grid-cols-1 gap-6"
        layout
      >
        {filteredChannels.map((channel) => (
          <motion.div
            key={channel.id}
            className="cursor-pointer"
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <ChannelCard
              channel={channel}
              selected={channel.id === selectedChannel}
              onClick={() => onSelect(channel.id)}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}