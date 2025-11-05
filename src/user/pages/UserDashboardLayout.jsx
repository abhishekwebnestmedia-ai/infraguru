import React from 'react';
import { Outlet } from 'react-router-dom';
import TopBar from '../../shared/components/TopBar';

const UserDashboardLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
};

export default UserDashboardLayout;
