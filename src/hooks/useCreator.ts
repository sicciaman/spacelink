import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import type { Creator } from '../lib/types';
import toast from 'react-hot-toast';

export function useCreator() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: creator, isLoading } = useQuery({
    queryKey: ['creator', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('creators')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      return data as Creator;
    },
    enabled: !!user
  });

  const createCreator = useMutation({
    mutationFn: async (data: Partial<Creator>) => {
      const { data: newCreator, error } = await supabase
        .from('creators')
        .insert({
          user_id: user?.id,
          ...data
        })
        .select()
        .single();

      if (error) throw error;
      return newCreator;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creator'] });
      toast.success('Creator profile created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create creator profile');
    }
  });

  const updateCreator = useMutation({
    mutationFn: async (data: Partial<Creator>) => {
      const { error } = await supabase
        .from('creators')
        .update(data)
        .eq('user_id', user?.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creator'] });
      toast.success('Creator profile updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update creator profile');
    }
  });

  return {
    creator,
    isLoading,
    createCreator,
    updateCreator
  };
}