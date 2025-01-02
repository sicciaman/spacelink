import { Link, useLocation } from 'react-router-dom';
import { Globe, ShieldCheck, LayoutDashboard, Radio } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../lib/utils/styles';

export default function MainNav() {
  const { user } = useAuth();
  const location = useLocation();
  const isAdminSection = location.pathname.startsWith('/admin');

  return (
    <nav className="flex items-center space-x-6">
      <Link to="/" className="text-xl font-bold text-gray-900 flex items-center">
        <Globe className="w-6 h-6 mr-2" />
        SpaceLink
      </Link>
      
      {user && (
        <>
          <Link
            to="/"
            className={cn(
              "flex items-center text-sm font-medium",
              location.pathname === '/'
                ? "text-blue-600 hover:text-blue-700"
                : "text-gray-600 hover:text-gray-900"
            )}
          >
            <LayoutDashboard className="w-4 h-4 mr-1" />
            Dashboard
          </Link>

          <Link
            to="/network"
            className={cn(
              "flex items-center text-sm font-medium",
              location.pathname === '/network'
                ? "text-blue-600 hover:text-blue-700"
                : "text-gray-600 hover:text-gray-900"
            )}
          >
            <Radio className="w-4 h-4 mr-1" />
            Network
          </Link>

          {user.role === 'admin' && (
            <Link
              to="/admin/bookings"
              className={cn(
                "flex items-center text-sm font-medium",
                isAdminSection 
                  ? "text-blue-600 hover:text-blue-700" 
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              <ShieldCheck className="w-4 h-4 mr-1" />
              Admin Panel
            </Link>
          )}
        </>
      )}
    </nav>
  );
}