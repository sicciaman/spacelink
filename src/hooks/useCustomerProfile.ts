import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import type { Customer } from '../lib/types';

export function useCustomerProfile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['customerProfile', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('customers')
        .select(`
          *,
          user_profiles!inner (
            email,
            created_at
          )
        `)
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      return {
        ...data,
        email: data.user_profiles.email,
        created_at: data.user_profiles.created_at
      };
    },
    enabled: !!user
  });

  const updateProfile = useMutation({
    mutationFn: async (updates: Partial<Customer>) => {
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('customers')
        .update(updates)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customerProfile'] });
    }
  });

  return {
    profile,
    isLoading,
    updateProfile
  };
}