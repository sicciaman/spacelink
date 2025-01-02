import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { Channel } from '../lib/types';

export function useChannels() {
  return useQuery({
    queryKey: ['channels'],
    queryFn: async () => {
      // Fetch channels with all related data
      const { data: channels, error: channelsError } = await supabase
        .from('channels')
        .select(`
          *,
          stats:channel_stats(*),
          tags:channel_tag_mappings(
            tag:channel_tags(*)
          ),
          badges:channel_badges(*)
        `)
        .order('name');

      if (channelsError) throw channelsError;

      // Transform the data structure
      return channels.map(channel => ({
        ...channel,
        stats: channel.stats || null,
        tags: channel.tags?.map(t => t.tag) || [],
        badges: channel.badges || []
      })) as Channel[];
    }
  });
}