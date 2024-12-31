import { Link } from 'react-router-dom';
import { Globe, LogIn } from 'lucide-react';
import Footer from './common/Footer';

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/landing" className="text-xl font-bold text-gray-900 flex items-center">
            <Globe className="w-6 h-6 mr-2" />
            SpaceLink
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <LogIn className="w-4 h-4 mr-2" />
            Sign In
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <Footer />
    </div>
  );
}