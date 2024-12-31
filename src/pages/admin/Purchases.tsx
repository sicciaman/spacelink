import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { supabase } from '../../lib/supabase';
import { Package } from 'lucide-react';
import EmptyPurchases from '../../components/admin/purchases/EmptyPurchases';
import ChannelFilter from '../../components/common/ChannelFilter';

export default function Purchases() {
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);

  const { data: purchases = [], isLoading } = useQuery({
    queryKey: ['admin-purchases', selectedChannel],
    queryFn: async () => {
      let query = supabase
        .from('purchases')
        .select(`
          *,
          packages!inner (*),
          user_profiles!inner (
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (selectedChannel) {
        query = query.eq('packages.channel_id', selectedChannel);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      return data.map(purchase => ({
        ...purchase,
        userEmail: purchase.user_profiles.email
      }));
    }
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!purchases?.length) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">Purchases</h1>
          <ChannelFilter
            selectedChannel={selectedChannel}
            onChange={setSelectedChannel}
          />
        </div>
        <EmptyPurchases />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">Purchases</h1>
        <ChannelFilter
          selectedChannel={selectedChannel}
          onChange={setSelectedChannel}
        />
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Package
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Posts
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {purchases.map((purchase) => (
                <tr key={purchase.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {purchase.userEmail}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <Package className="h-4 w-4 text-gray-400 mr-2" />
                      {purchase.packages.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    €{purchase.amount_paid}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {purchase.posts_remaining} / {purchase.packages.post_count}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(purchase.created_at), 'PP')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}