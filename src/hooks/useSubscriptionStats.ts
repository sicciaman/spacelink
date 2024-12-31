import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { TimeInterval } from './useProfileStats';
import { subMonths } from 'date-fns';

interface SubscriptionStats {
  activeSubscribers: number;
  newSubscriptions: number;
  renewalRate: number;
  avgSubscriptionLength: number;
}

export function useSubscriptionStats(interval: TimeInterval = '30days') {
  return useQuery({
    queryKey: ['subscription-stats', interval],
    queryFn: async () => {
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

      // Get subscription data
      const { data: subscriptions, error } = await supabase
        .from('subscriptions')
        .select('*')
        .gte('created_at', startDate.toISOString());

      if (error) throw error;

      // Calculate statistics
      const activeSubscribers = subscriptions.filter(s => 
        s.status === 'active' && new Date(s.current_period_end) > now
      ).length;

      const newSubscriptions = subscriptions.filter(s => 
        new Date(s.created_at) >= startDate
      ).length;

      const renewedSubscriptions = subscriptions.filter(s => 
        s.status === 'active' && 
        new Date(s.current_period_start) >= startDate
      ).length;

      const totalSubscriptions = subscriptions.length;
      const renewalRate = totalSubscriptions > 0 
        ? (renewedSubscriptions / totalSubscriptions) * 100 
        : 0;

      // Calculate average subscription length in days
      const avgSubscriptionLength = subscriptions.reduce((acc, s) => {
        const start = new Date(s.created_at);
        const end = s.status === 'active' ? now : new Date(s.current_period_end);
        const days = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        return acc + days;
      }, 0) / (totalSubscriptions || 1);

      return {
        activeSubscribers,
        newSubscriptions,
        renewalRate: Math.round(renewalRate),
        avgSubscriptionLength: Math.round(avgSubscriptionLength)
      } as SubscriptionStats;
    }
  });
}