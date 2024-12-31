import { Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import MainNav from './common/MainNav';
import UserNav from './common/UserNav';
import Footer from './common/Footer';
import LoadingScreen from './common/LoadingScreen';
import { useRole } from '../hooks/useRole';

export default function Layout() {
  const { signOut, loading: authLoading } = useAuth();
  const { isLoading: roleLoading } = useRole();

  if (authLoading || roleLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <MainNav />
          <UserNav signOut={signOut} />
        </div>
      </header>
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  );
}