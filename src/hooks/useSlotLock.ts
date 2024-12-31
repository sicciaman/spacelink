import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import type { SlotLock } from '../lib/types';
import { formatDateTime } from '../lib/utils/dateTime';

const LOCK_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export function useSlotLock(channelId: string | null, date: Date | null) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Check if slot is locked
  const { data: lock } = useQuery({
    queryKey: ['slotLock', channelId, date?.toISOString()],
    queryFn: async () => {
      if (!channelId || !date) return null;
      
      // Clean expired locks first
      await supabase.rpc('clean_expired_locks');
      
      const { data, error } = await supabase.rpc('get_active_lock', {
        p_channel_id: channelId,
        p_booking_date: formatDateTime(date)
      });

      if (error) throw error;
      return data as SlotLock | null;
    },
    enabled: !!channelId && !!date,
    refetchInterval: 1000 // Poll every second
  });

  // Create lock
  const createLock = useMutation({
    mutationFn: async ({ channelId, date }: { channelId: string, date: Date }) => {
      if (!user) throw new Error('User not authenticated');
      
      const expiresAt = new Date(Date.now() + LOCK_DURATION);
      
      const { data, error } = await supabase.rpc('create_slot_lock', {
        p_channel_id: channelId,
        p_booking_date: formatDateTime(date),
        p_expires_at: formatDateTime(expiresAt)
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['slotLock'] });
    }
  });

  // Release lock
  const releaseLock = useMutation({
    mutationFn: async () => {
      if (!lock?.id || !user) return;
      
      const { error } = await supabase.rpc('release_slot_lock', {
        p_lock_id: lock.id
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['slotLock'] });
    }
  });

  const isLocked = !!lock && lock.user_id !== user?.id;
  const isOwnLock = !!lock && lock.user_id === user?.id;
  const lockExpiresAt = lock?.expires_at ? new Date(lock.expires_at) : null;

  return {
    isLocked,
    isOwnLock,
    lockExpiresAt,
    createLock,
    releaseLock
  };
}