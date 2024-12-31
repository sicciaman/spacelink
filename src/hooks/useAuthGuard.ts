import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export function useAuthGuard() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user: authUser }, error } = await supabase.auth.getUser();
        
        if (error || !authUser) {
          await supabase.auth.signOut();
          toast.error('Please sign in to continue');
          navigate('/login', { replace: true });
          return false;
        }
        return true;
      } catch (error) {
        console.error('Auth check failed:', error);
        navigate('/login', { replace: true });
        return false;
      }
    };

    if (!loading) {
      if (!user) {
        navigate('/login', { replace: true });
      } else {
        // Only check auth if we have a user
        checkAuth();
      }
    }
  }, [user, loading, navigate]);

  return { isAuthenticated: !!user, isLoading: loading };
}