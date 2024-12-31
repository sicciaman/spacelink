import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { TimeInterval } from './useProfileStats';
import { subMonths } from 'date-fns';

interface AdminStats {
  totalCustomers: number;
  customerGrowth: number;
  totalRevenue: number;
  revenueGrowth: number;
  activeSubscribers: number;
  subscriberGrowth: number;
  totalPosts: number;
  postGrowth: number;
}

export function useAdminStats(interval: TimeInterval = '30days') {
  return useQuery({
    queryKey: ['admin-stats', interval],
    queryFn: async () => {
      try {
        // Calculate date ranges
        const now = new Date();
        let startDate, previousStartDate;
        
        switch (interval) {
          case '30days':
            startDate = subMonths(now, 1);
            previousStartDate = subMonths(startDate, 1);
            break;
          case '90days':
            startDate = subMonths(now, 3);
            previousStartDate = subMonths(startDate, 3);
            break;
          case '6months':
            startDate = subMonths(now, 6);
            previousStartDate = subMonths(startDate, 6);
            break;
          case '12months':
            startDate = subMonths(now, 12);
            previousStartDate = subMonths(startDate, 12);
            break;
          case 'all':
            startDate = new Date(0);
            previousStartDate = new Date(0);
            break;
        }

        // Fetch current period data
        const [customersResponse, revenueResponse, subscribersResponse, postsResponse] = await Promise.all([
          // Get total customers
          supabase
            .from('customers')
            .select('id')
            .gte('created_at', startDate.toISOString()),

          // Get total revenue
          supabase
            .from('purchases')
            .select('amount_paid')
            .gte('created_at', startDate.toISOString()),

          // Get active subscribers
          supabase
            .from('subscriptions')
            .select('id')
            .eq('status', 'active')
            .gt('current_period_end', now.toISOString()),

          // Get total posts
          supabase
            .from('bookings')
            .select('id')
            .gte('created_at', startDate.toISOString())
        ]);

        // Handle potential errors
        if (customersResponse.error) throw customersResponse.error;
        if (revenueResponse.error) throw revenueResponse.error;
        if (subscribersResponse.error) throw subscribersResponse.error;
        if (postsResponse.error) throw postsResponse.error;

        // Fetch previous period data for growth calculation
        const [prevCustomersResponse, prevRevenueResponse, prevSubscribersResponse, prevPostsResponse] = await Promise.all([
          supabase
            .from('customers')
            .select('id')
            .gte('created_at', previousStartDate.toISOString())
            .lt('created_at', startDate.toISOString()),

          supabase
            .from('purchases')
            .select('amount_paid')
            .gte('created_at', previousStartDate.toISOString())
            .lt('created_at', startDate.toISOString()),

          supabase
            .from('subscriptions')
            .select('id')
            .eq('status', 'active')
            .gt('current_period_end', previousStartDate.toISOString())
            .lte('current_period_end', startDate.toISOString()),

          supabase
            .from('bookings')
            .select('id')
            .gte('created_at', previousStartDate.toISOString())
            .lt('created_at', startDate.toISOString())
        ]);

        // Handle potential errors
        if (prevCustomersResponse.error) throw prevCustomersResponse.error;
        if (prevRevenueResponse.error) throw prevRevenueResponse.error;
        if (prevSubscribersResponse.error) throw prevSubscribersResponse.error;
        if (prevPostsResponse.error) throw prevPostsResponse.error;

        // Calculate current period values
        const totalCustomers = customersResponse.data?.length || 0;
        const totalRevenue = revenueResponse.data?.reduce((sum, p) => sum + (p.amount_paid || 0), 0) || 0;
        const activeSubscribers = subscribersResponse.data?.length || 0;
        const totalPosts = postsResponse.data?.length || 0;

        // Calculate previous period values
        const prevCustomers = prevCustomersResponse.data?.length || 0;
        const prevRevenue = prevRevenueResponse.data?.reduce((sum, p) => sum + (p.amount_paid || 0), 0) || 0;
        const prevSubscribers = prevSubscribersResponse.data?.length || 0;
        const prevPosts = prevPostsResponse.data?.length || 0;

        // Calculate growth percentages with safety checks
        const customerGrowth = prevCustomers ? ((totalCustomers - prevCustomers) / prevCustomers) * 100 : 0;
        const revenueGrowth = prevRevenue ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : 0;
        const subscriberGrowth = prevSubscribers ? ((activeSubscribers - prevSubscribers) / prevSubscribers) * 100 : 0;
        const postGrowth = prevPosts ? ((totalPosts - prevPosts) / prevPosts) * 100 : 0;

        return {
          totalCustomers,
          customerGrowth: Math.round(customerGrowth),
          totalRevenue,
          revenueGrowth: Math.round(revenueGrowth),
          activeSubscribers,
          subscriberGrowth: Math.round(subscriberGrowth),
          totalPosts,
          postGrowth: Math.round(postGrowth)
        } as AdminStats;
      } catch (error) {
        console.error('Error fetching admin stats:', error);
        throw error;
      }
    },
    // Refresh data frequently
    refetchInterval: 30000, // 30 seconds
    staleTime: 15000, // 15 seconds
    retry: 2
  });
}