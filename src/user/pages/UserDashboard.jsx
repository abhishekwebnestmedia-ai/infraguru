import React, { useMemo } from 'react';
import { useAuth } from '../../shared/hooks/useAuth';
import { Home, FileText, User, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNotifications } from '../../shared/hooks/useNotifications';

const UserDashboard = () => {
  const { user } = useAuth();

  // simplified dashboard; quick actions removed as unused

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

      {/* Stats Overview */}
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-600 font-medium">Captured Leads</p>
            <p className="text-3xl font-bold text-blue-700 mt-2">{user?.stats?.capturedLeads ?? 0}</p>
          </div>

          <div className="bg-indigo-50 rounded-lg p-4">
            <p className="text-sm text-indigo-600 font-medium">Assigned Leads</p>
            <p className="text-3xl font-bold text-indigo-700 mt-2">{user?.stats?.assignedLeads ?? 0}</p>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm text-green-600 font-medium">Closed Leads</p>
            <p className="text-3xl font-bold text-green-700 mt-2">{user?.stats?.closedLeads ?? 0}</p>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4">
            <p className="text-sm text-yellow-600 font-medium">Transferred Leads</p>
            <p className="text-3xl font-bold text-yellow-700 mt-2">{user?.stats?.transferredLeads ?? 0}</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>
        <RecentFollowups />
      </div>
    </div>
  );                
};

export default UserDashboard;

const RecentFollowups = () => {
  const { notifications, loading } = useNotifications();

  const followups = useMemo(() => {
    if (!Array.isArray(notifications)) return [];
    const isSameDay = (d1, d2) => {
      if (!d1 || !d2) return false;
      return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
    };
    const today = new Date();
    return notifications
      .filter(n => String(n.category || '').toLowerCase() === 'followup')
      .map(n => ({ ...n, _parsedDate: new Date(n.createdAt) }))
      .filter(n => !isNaN(n._parsedDate.getTime()) && isSameDay(n._parsedDate, today))
      .sort((a,b) => b._parsedDate - a._parsedDate)
      .slice(0, 6);
  }, [notifications]);

  if (loading) {
    return (
      <div className="text-center py-8 text-gray-600">Loading recent activity…</div>
    );
  }

  if (!followups || followups.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <Home size={48} className="mx-auto mb-4 opacity-20" />
        <p>No recent follow-ups</p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {followups.map(f => (
        <li key={f._id} className="p-3 rounded-lg">
          <div className="text-sm text-gray-800 whitespace-pre-wrap">{f.message}</div>
          <div className="text-xs text-gray-500 mt-1">{new Date(f.createdAt).toLocaleString()}</div>
        </li>
      ))}
    </ul>
  );
};
