import { motion } from 'framer-motion';
import { ExternalLink, Users, Eye, TrendingUp } from 'lucide-react';
import type { EnhancedChannel } from './types';
import { cn } from '../../lib/utils/styles';

interface Props {
  channel: EnhancedChannel;
  selected?: boolean;
  onClick?: () => void;
}

export default function ChannelCard({ channel, selected, onClick }: Props) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={cn(
        "relative rounded-xl border p-6 transition-all duration-200",
        selected ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-200 hover:border-gray-300",
        "bg-white shadow-sm hover:shadow-md"
      )}
      onClick={onClick}
    >
      {/* Featured badge */}
      {channel.featured && (
        <div className="absolute -top-2 -right-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm">
            Featured
          </span>
        </div>
      )}

      <div className="flex items-start space-x-4">
        {/* Channel Logo */}
        <div className="flex-shrink-0">
          <img 
            src={channel.logoUrl} 
            alt={channel.name}
            className="w-16 h-16 rounded-full"
          />
        </div>

        {/* Channel Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {channel.name}
            </h3>
            
            {/* Badges */}
            <div className="flex space-x-2">
              {channel.badges?.map((badge) => (
                <span 
                  key={badge.type}
                  className={cn(
                    "inline-flex items-center px-2 py-1 rounded-md text-xs font-medium",
                    badge.type === 'top' ? "bg-yellow-100 text-yellow-800" :
                    badge.type === 'trending' ? "bg-green-100 text-green-800" :
                    "bg-blue-100 text-blue-800"
                  )}
                >
                  {badge.label}
                </span>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="mt-1 flex flex-wrap gap-2">
            {channel.tags.map((tag) => (
              <span
                key={tag.id}
                className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium"
                style={{ 
                  backgroundColor: `${tag.color}20`,
                  color: tag.color 
                }}
              >
                {tag.name}
              </span>
            ))}
          </div>

          <p className="mt-2 text-sm text-gray-600">
            {channel.description}
          </p>

          {/* Stats */}
          <div className="mt-4 flex items-center space-x-6 text-sm">
            <div className="flex items-center text-gray-600">
              <Users className="w-4 h-4 mr-1" />
              {channel.stats.memberCount.toLocaleString()} members
            </div>
            <div className="flex items-center text-gray-600">
              <Eye className="w-4 h-4 mr-1" />
              {channel.stats.avgViews24h.toLocaleString()} views/24h
            </div>
          </div>

          {/* Channel Link */}
          <a
            href={channel.telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center text-sm text-blue-600 hover:text-blue-500"
            onClick={(e) => e.stopPropagation()}
          >
            View Channel
            <ExternalLink className="w-4 h-4 ml-1" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}