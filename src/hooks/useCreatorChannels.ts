import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { Channel } from '../lib/types';
import { useCreator } from './useCreator';
import toast from 'react-hot-toast';

export function useCreatorChannels() {
  const { creator } = useCreator();
  const queryClient = useQueryClient();

  const { data: channels, isLoading } = useQuery({
    queryKey: ['creatorChannels', creator?.id],
    queryFn: async () => {
      if (!creator) return [];

      const { data, error } = await supabase
        .from('creator_channels')
        .select(`
          *,
          stats:channel_stats(*),
          tags:channel_tag_mappings(
            tag:channel_tags(*)
          ),
          badges:channel_badges(*)
        `)
        .order('name');

      if (error) throw error;
      return data as Channel[];
    },
    enabled: !!creator
  });

  const updateChannel = useMutation({
    mutationFn: async ({ channelId, updates }: { channelId: string; updates: Partial<Channel> }) => {
      const { error } = await supabase
        .from('channels')
        .update(updates)
        .eq('id', channelId)
        .eq('creator_id', creator?.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creatorChannels'] });
      toast.success('Channel updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update channel');
    }
  });

  const createChannel = useMutation({
    mutationFn: async (channel: Partial<Channel>) => {
      const { error } = await supabase
        .from('channels')
        .insert({
          ...channel,
          creator_id: creator?.id
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creatorChannels'] });
      toast.success('Channel created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create channel');
    }
  });

  return {
    channels,
    isLoading,
    updateChannel,
    createChannel
  };
}