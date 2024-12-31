import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../../components/admin/layout/AdminSidebar';
import AdminHeader from '../../components/admin/layout/AdminHeader';
import DashboardStats from '../../components/admin/dashboard/DashboardStats';
import DashboardCharts from '../../components/admin/dashboard/DashboardCharts';
import DashboardSummary from '../../components/admin/dashboard/DashboardSummary';

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div 
          className="fixed inset-0 bg-gray-900/80" 
          onClick={() => setSidebarOpen(false)} 
        />
        <nav className="fixed left-0 top-0 bottom-0 w-64 bg-white">
          <AdminSidebar onNavigate={() => setSidebarOpen(false)} />
        </nav>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-40 lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-gray-200 lg:bg-white">
        <AdminSidebar />
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        <AdminHeader onMobileMenuClick={() => setSidebarOpen(true)} />
        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}