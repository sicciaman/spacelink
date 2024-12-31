import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';
import { useRole } from './useRole';

export function useAuthRedirect() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: authLoading } = useAuth();
  const { data: role, isLoading: roleLoading } = useRole();

  useEffect(() => {
    // Only proceed if both auth and role checks are complete
    if (authLoading || roleLoading) return;

    // Handle unauthenticated users
    if (!user) {
      if (location.pathname !== '/login') {
        navigate('/login', { replace: true });
      }
      return;
    }

    // Handle authenticated users
    if (role === 'admin') {
      // Only redirect admin if they're not already in admin area
      if (!location.pathname.startsWith('/admin')) {
        navigate('/admin/bookings', { replace: true });
      }
    } else if (location.pathname.startsWith('/admin')) {
      // Redirect non-admin users away from admin routes
      navigate('/', { replace: true });
    }
  }, [user, role, authLoading, roleLoading, navigate, location.pathname]);

  return {
    isLoading: authLoading || roleLoading,
    isAuthenticated: !!user,
    role
  };
}