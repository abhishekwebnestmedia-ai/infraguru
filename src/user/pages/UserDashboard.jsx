import React from 'react';
import { useAuth } from '../../shared/hooks/useAuth';
import { Home, FileText, User, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
  const { user } = useAuth();

  const quickActions = [
    { icon: FileText, label: 'My Leads', path: '/user/leads', color: 'bg-blue-500' },
    { icon: MessageSquare, label: 'Broadcast', path: '/user/broadcast', color: 'bg-green-500' },
    { icon: User, label: 'Profile', path: '/user/profile', color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Welcome back, {user?.name || 'User'}!
            </h1>
            <p className="text-gray-600">Here's what's happening with your work today.</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickActions.map((action, index) => (
          <Link
            key={index}
            to={action.path}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-6 flex items-center gap-4 group"
          >
            <div className={`${action.color} p-3 rounded-lg text-white group-hover:scale-110 transition-transform`}>
              <action.icon size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">{action.label}</h3>
              <p className="text-sm text-gray-600">View & manage</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Stats Overview */}
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-600 font-medium">Total Leads</p>
            <p className="text-3xl font-bold text-blue-700 mt-2">0</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm text-green-600 font-medium">Active Leads</p>
            <p className="text-3xl font-bold text-green-700 mt-2">0</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <p className="text-sm text-purple-600 font-medium">Completed</p>
            <p className="text-3xl font-bold text-purple-700 mt-2">0</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>
        <div className="text-center py-12 text-gray-500">
          <Home size={48} className="mx-auto mb-4 opacity-20" />
          <p>No recent activity to display</p>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
