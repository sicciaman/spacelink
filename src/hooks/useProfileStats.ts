import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import { startOfMonth, subMonths, endOfMonth } from 'date-fns';

export type TimeInterval = '30days' | '90days' | '6months' | '12months' | 'all';

interface ProfileStats {
  totalPosts: number;
  completedPosts: number;
  upcomingPosts: number;
  cancelledPosts: number;
  totalSpent: number;
  bundleSavings: number;
}

export function useProfileStats(interval: TimeInterval = '30days') {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['profileStats', user?.id, interval],
    queryFn: async () => {
      if (!user) return null;

      // Calculate date range based on interval
      const now = new Date();
      let startDate;
      
      switch (interval) {
        case '30days':
          startDate = subMonths(now, 1);
          break;
        case '90days':
          startDate = subMonths(now, 3);
          break;
        case '6months':
          startDate = subMonths(now, 6);
          break;
        case '12months':
          startDate = subMonths(now, 12);
          break;
        case 'all':
          startDate = new Date(0);
          break;
      }

      // Get all purchases and bookings for the user within the date range
      const [purchasesResponse, bookingsResponse, packagesResponse] = await Promise.all([
        supabase
          .from('purchases')
          .select('*, packages(*)')
          .eq('user_id', user.id)
          .gte('created_at', startDate.toISOString()),
        supabase
          .from('bookings')
          .select('*')
          .eq('user_id', user.id)
          .gte('created_at', startDate.toISOString()),
        supabase
          .from('packages')
          .select('*')
      ]);

      if (purchasesResponse.error) throw purchasesResponse.error;
      if (bookingsResponse.error) throw bookingsResponse.error;
      if (packagesResponse.error) throw packagesResponse.error;

      const purchases = purchasesResponse.data;
      const bookings = bookingsResponse.data;
      const packages = packagesResponse.data;

      // Calculate booking stats
      const totalPosts = bookings.length;
      const completedPosts = bookings.filter(b => b.status === 'completed').length;
      const upcomingPosts = bookings.filter(b => b.status === 'pending').length;
      const cancelledPosts = bookings.filter(b => b.status === 'cancelled').length;

      // Calculate total spent
      const totalSpent = purchases.reduce((acc, purchase) => acc + purchase.amount_paid, 0);

      // Calculate bundle savings
      const bundleSavings = purchases.reduce((acc, purchase) => {
        // Get the single post price for this package's channel
        const singlePostPackage = packages.find(p => 
          p.channel_id === purchase.packages.channel_id && 
          p.post_count === 1
        );
        
        if (!singlePostPackage) return acc;

        // Calculate what it would cost to buy the same number of posts individually
        const singlePostPrice = singlePostPackage.price;
        const totalSinglePostCost = singlePostPrice * purchase.packages.post_count;
        
        // Calculate the actual cost paid for the bundle
        const actualCost = purchase.amount_paid;
        
        // The savings is the difference
        return acc + (totalSinglePostCost - actualCost);
      }, 0);

      return {
        totalPosts,
        completedPosts,
        upcomingPosts,
        cancelledPosts,
        totalSpent,
        bundleSavings
      } as ProfileStats;
    },
    enabled: !!user
  });
}