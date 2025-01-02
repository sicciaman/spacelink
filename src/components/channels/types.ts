export interface ChannelStats {
  memberCount: number;
  avgViews24h: number;
  engagementRate: number;
}

export interface ChannelTag {
  id: string;
  name: string;
  color: string;
}

export interface EnhancedChannel {
  id: string;
  name: string;
  description: string;
  logoUrl: string;
  telegramUrl: string;
  type: 'main' | 'specialized';
  featured: boolean;
  stats: ChannelStats;
  tags: ChannelTag[];
  badges?: {
    type: 'top' | 'trending' | 'new';
    label: string;
  }[];
}