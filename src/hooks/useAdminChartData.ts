import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { TimeInterval } from './useProfileStats';
import { subMonths, format, eachDayOfInterval, startOfDay, endOfDay } from 'date-fns';

interface ChartData {
  revenue: { date: string; amount: number }[];
  postsByChannel: { channel: string; posts: number }[];
}

export function useAdminChartData(interval: TimeInterval = '30days') {
  return useQuery({
    queryKey: ['admin-chart-data', interval],
    queryFn: async () => {
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

      // Get all days in the interval
      const days = eachDayOfInterval({ start: startDate, end: now });

      // Fetch revenue data
      const { data: purchases } = await supabase
        .from('purchases')
        .select('amount_paid, created_at')
        .gte('created_at', startDate.toISOString());

      // Group revenue by date
      const revenue = days.map(day => {
        const dayStart = startOfDay(day);
        const dayEnd = endOfDay(day);
        const dayRevenue = purchases?.filter(p => {
          const purchaseDate = new Date(p.created_at);
          return purchaseDate >= dayStart && purchaseDate <= dayEnd;
        }).reduce((sum, p) => sum + p.amount_paid, 0) || 0;

        return {
          date: format(day, 'MMM d'),
          amount: dayRevenue
        };
      });

      // Fetch posts by channel
      const { data: channels } = await supabase
        .from('channels')
        .select('name');

      const postsByChannelPromises = channels?.map(async channel => {
        const { count } = await supabase
          .from('bookings')
          .select('count')
          .eq('channel_id', channel.id)
          .gte('created_at', startDate.toISOString());

        return {
          channel: channel.name,
          posts: count || 0
        };
      }) || [];

      const postsByChannel = await Promise.all(postsByChannelPromises);

      return {
        revenue,
        postsByChannel: postsByChannel.sort((a, b) => b.posts - a.posts)
      } as ChartData;
    }
  });
}