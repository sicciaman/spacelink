import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar, Package, Users, Star } from 'lucide-react';
import { cn } from '../../../lib/utils/styles';

const navigation = [
  { name: 'Overview', href: '/admin', icon: LayoutDashboard },
  { name: 'Bookings', href: '/admin/bookings', icon: Calendar },
  { name: 'Purchases', href: '/admin/purchases', icon: Package },
  { name: 'Subscriptions', href: '/admin/subscriptions', icon: Star },
  { name: 'Customers', href: '/admin/customers', icon: Users },
];

interface Props {
  onNavigate?: () => void;
}

export default function AdminSidebar({ onNavigate }: Props) {
  const location = useLocation();

  return (
    <div className="flex flex-1 flex-col gap-y-5">
      <div className="flex h-16 shrink-0 items-center px-6">
        <h1 className="text-lg font-semibold text-gray-900">Admin Dashboard</h1>
      </div>
      <nav className="flex flex-1 flex-col px-6">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      onClick={onNavigate}
                      className={cn(
                        'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6',
                        isActive
                          ? 'bg-gray-50 text-blue-600'
                          : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                      )}
                    >
                      <item.icon
                        className={cn(
                          'h-5 w-5 shrink-0',
                          isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-600'
                        )}
                      />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  );
}