import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { UserRole } from '../lib/types';
import { useAuth } from './useAuth';

export function useRole() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['userRole', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Role query error:', error);
        return null;
      }

      return data?.role as UserRole;
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1
  });
}