import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { TimeInterval } from './useProfileStats';
import { subMonths } from 'date-fns';

interface Activity {
  id: string;
  type: 'booking' | 'purchase' | 'subscription';
  description: string;
  timestamp: string;
  iconType: 'calendar' | 'package' | 'star';
}

interface AdminSummary {
  recentActivity: Activity[];
}

export function useAdminSummary(interval: TimeInterval = '30days') {
  return useQuery({
    queryKey: ['admin-summary', interval],
    queryFn: async () => {
      try {
        // Calculate date range
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

        // Fetch recent activities
        const [bookingsResult, purchasesResult, subscriptionsResult] = await Promise.all([
          // Get recent bookings
          supabase
            .from('bookings')
            .select(`
              id,
              created_at,
              channels (
                name
              ),
              user_profiles!inner (
                email
              )
            `)
            .gte('created_at', startDate.toISOString())
            .order('created_at', { ascending: false })
            .limit(10),

          // Get recent purchases
          supabase
            .from('purchases')
            .select(`
              id,
              created_at,
              packages (
                name
              ),
              user_profiles!inner (
                email
              )
            `)
            .gte('created_at', startDate.toISOString())
            .order('created_at', { ascending: false })
            .limit(10),

          // Get recent subscriptions
          supabase
            .from('subscriptions')
            .select(`
              id,
              created_at,
              user_profiles!inner (
                email
              )
            `)
            .gte('created_at', startDate.toISOString())
            .order('created_at', { ascending: false })
            .limit(10)
        ]);

        if (bookingsResult.error) throw bookingsResult.error;
        if (purchasesResult.error) throw purchasesResult.error;
        if (subscriptionsResult.error) throw subscriptionsResult.error;

        // Combine all activities
        const activities: Activity[] = [
          ...(bookingsResult.data?.map(booking => ({
            id: booking.id,
            type: 'booking' as const,
            description: `${booking.user_profiles.email} booked a post on ${booking.channels?.name}`,
            timestamp: booking.created_at,
            iconType: 'calendar' as const
          })) || []),

          ...(purchasesResult.data?.map(purchase => ({
            id: purchase.id,
            type: 'purchase' as const,
            description: `${purchase.user_profiles.email} purchased ${purchase.packages?.name}`,
            timestamp: purchase.created_at,
            iconType: 'package' as const
          })) || []),

          ...(subscriptionsResult.data?.map(subscription => ({
            id: subscription.id,
            type: 'subscription' as const,
            description: `${subscription.user_profiles.email} subscribed to Prime`,
            timestamp: subscription.created_at,
            iconType: 'star' as const
          })) || [])
        ];

        // Sort by timestamp and limit to 10 most recent
        activities.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );

        return {
          recentActivity: activities.slice(0, 10)
        } as AdminSummary;
      } catch (error) {
        console.error('Error fetching admin summary:', error);
        throw error;
      }
    },
    // Refresh data frequently
    refetchInterval: 30000, // 30 seconds
    staleTime: 15000, // 15 seconds
    retry: 2
  });
}