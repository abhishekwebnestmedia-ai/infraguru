import React from 'react';
import { useAuth } from '../hooks/useAuth';
import HomeDashboard from '../../admin/components/HomeDashboard';
import UserDashboard from '../../user/pages/UserDashboard';

const DashboardSwitcher = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-3"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const role = user?.role || (user?.isAdmin ? 'admin' : 'user');

  // Admin sees Admin HomeDashboard; user sees UserDashboard
  return role === 'admin' ? <HomeDashboard /> : <UserDashboard />;
};

export default DashboardSwitcher;
