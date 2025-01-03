import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { ChannelSettings } from '../lib/types';
import toast from 'react-hot-toast';

export function useChannelSettings(channelId: string, creatorId?: string) {
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ['channelSettings', channelId],
    queryFn: async () => {
      // If creatorId is provided, fetch by both channel and creator
      let query = supabase
        .from('channel_settings')
        .select('*')
        .eq('channel_id', channelId);

      if (creatorId) {
        query = query.eq('creator_id', creatorId);
      }

      const { data, error } = await query.maybeSingle();

      if (error && error.code !== 'PGRST116') { // Ignore "no rows returned" error
        throw error;
      }
      
      return data as ChannelSettings | null;
    },
    enabled: !!channelId
  });

  const updateSettings = useMutation({
    mutationFn: async (newSettings: Partial<ChannelSettings['settings']>) => {
      if (!creatorId) {
        throw new Error('Creator ID is required to update settings');
      }

      // If settings don't exist, create them
      if (!settings) {
        const { error } = await supabase
          .from('channel_settings')
          .insert({
            channel_id: channelId,
            creator_id: creatorId,
            settings: newSettings
          });

        if (error) throw error;
      } else {
        // Update existing settings
        const { error } = await supabase
          .from('channel_settings')
          .update({
            settings: { ...settings.settings, ...newSettings }
          })
          .eq('channel_id', channelId)
          .eq('creator_id', creatorId);

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['channelSettings', channelId] });
      toast.success('Channel settings updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update channel settings');
    }
  });

  return {
    settings,
    isLoading,
    updateSettings
  };
}