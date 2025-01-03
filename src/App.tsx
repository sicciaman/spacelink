import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import LandingLayout from './components/LandingLayout';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Purchase from './pages/Purchase';
import BookSlot from './pages/BookSlot';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Help from './pages/Help';
import Network from './pages/Network';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/admin/Dashboard';
import AdminOverview from './pages/admin/Overview';
import AdminBookings from './pages/admin/Bookings';
import AdminPurchases from './pages/admin/Purchases';
import AdminSubscriptions from './pages/admin/Subscriptions';
import AdminCustomers from './pages/admin/Customers';
import AdminSettings from './pages/admin/Settings';
import AdminNetwork from './pages/admin/Network';
import AuthRedirect from './components/AuthRedirect';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    }
  }
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/landing" element={
            <LandingLayout>
              <Landing />
            </LandingLayout>
          } />
          <Route path="/login" element={<Login />} />

          {/* Auth redirect */}
          <Route path="/" element={<AuthRedirect />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            {/* Customer routes with main layout */}
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/network" element={<Network />} />
              <Route path="/purchase" element={<Purchase />} />
              <Route path="/book/:purchaseId" element={<BookSlot />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/help" element={<Help />} />
            </Route>

            {/* Admin routes */}
            <Route path="admin" element={<AdminDashboard />}>
              <Route index element={<AdminOverview />} />
              <Route path="network" element={<AdminNetwork />} />
              <Route path="bookings" element={<AdminBookings />} />
              <Route path="purchases" element={<AdminPurchases />} />
              <Route path="subscriptions" element={<AdminSubscriptions />} />
              <Route path="customers" element={<AdminCustomers />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/landing" replace />} />
        </Routes>
        <Toaster position="top-right" />
      </Router>
    </QueryClientProvider>
  );
}