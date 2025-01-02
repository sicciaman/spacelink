import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useRole } from '../hooks/useRole';
import LoadingScreen from './common/LoadingScreen';

export default function AuthRedirect() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { data: role, isLoading: roleLoading } = useRole();

  useEffect(() => {
    if (authLoading || roleLoading) return;

    if (!user) {
      navigate('/landing', { replace: true });
    } else if (role === 'admin') {
      navigate('/admin/bookings', { replace: true });
    } else {
      navigate('/dashboard', { replace: true });
    }
  }, [user, role, authLoading, roleLoading, navigate]);

  if (authLoading || roleLoading) {
    return <LoadingScreen />;
  }

  return null;
}