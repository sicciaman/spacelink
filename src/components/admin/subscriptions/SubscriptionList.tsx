import { useState } from 'react';
import { format } from 'date-fns';
import { Star, AlertTriangle } from 'lucide-react';
import type { Subscription } from '../../../lib/types';
import { cn } from '../../../lib/utils/styles';
import EmptySubscriptions from './EmptySubscriptions';

interface Props {
  subscriptions: (Subscription & { userEmail: string })[];
  isLoading: boolean;
}

export default function SubscriptionList({ subscriptions, isLoading }: Props) {
  if (isLoading) {
    return <div>Loading subscriptions...</div>;
  }

  if (!subscriptions.length) {
    return <EmptySubscriptions />;
  }

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Period Start
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Period End
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {subscriptions.map((subscription) => {
              const isExpiringSoon = new Date(subscription.current_period_end) <= new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
              
              return (
                <tr key={subscription.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Star className={cn(
                          "h-5 w-5",
                          subscription.status === 'active' ? "text-yellow-400" : "text-gray-400"
                        )} />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {subscription.userEmail}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={cn(
                      "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
                      subscription.status === 'active' ? "bg-green-100 text-green-800" :
                      subscription.status === 'cancelled' ? "bg-yellow-100 text-yellow-800" :
                      "bg-red-100 text-red-800"
                    )}>
                      {subscription.status}
                    </span>
                    {isExpiringSoon && subscription.status !== 'expired' && (
                      <span className="ml-2 inline-flex items-center text-yellow-600">
                        <AlertTriangle className="h-4 w-4" />
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(subscription.current_period_start), 'PP')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(subscription.current_period_end), 'PP')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(subscription.created_at), 'PP')}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}