import React, { useMemo } from 'react';
import { useNotifications } from '../hooks/useNotifications';

function groupByDate(list) {
  const map = new Map();
  for (const n of list) {
    const d = new Date(n.createdAt);
    const key = isNaN(d.getTime()) ? 'Unknown' : d.toISOString().slice(0,10);
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(n);
  }
  // sort dates desc
  const entries = Array.from(map.entries()).sort((a,b) => b[0].localeCompare(a[0]));
  return entries;
}

function prettyDate(key) {
  if (key === 'Unknown') return 'Unknown';
  const d = new Date(key);
  const today = new Date();
  const yd = new Date(); yd.setDate(today.getDate()-1);
  const fmt = (dt) => dt.toISOString().slice(0,10);
  if (fmt(d) === fmt(today)) return 'Today';
  if (fmt(d) === fmt(yd)) return 'Yesterday';
  return d.toLocaleDateString();
}

const NotificationsPage = () => {
  const { notifications, loading, error } = useNotifications();
  const groups = useMemo(() => groupByDate(notifications || []), [notifications]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h1 className="text-xl font-semibold text-gray-800">Notifications</h1>
        <p className="text-sm text-gray-500">Real-time and recent updates about your leads.</p>
      </div>

      {loading && (
        <div className="bg-white rounded-2xl p-6 text-gray-600">Loading notifications…</div>
      )}
      {error && (
        <div className="bg-white rounded-2xl p-6 text-red-600">Failed to load notifications</div>
      )}

      {!loading && !error && groups.length === 0 && (
        <div className="bg-white rounded-2xl p-6 text-gray-600">No notifications yet</div>
      )}

      {groups.map(([dateKey, list]) => (
        <div key={dateKey} className="bg-white rounded-2xl shadow-sm">
          <div className="px-6 py-3 border-b">
            <h2 className="text-sm font-semibold text-gray-600">{prettyDate(dateKey)}</h2>
          </div>
          <ul className="divide-y">
            {list.map(n => (
              <li key={n._id} className="px-6 py-4 hover:bg-gray-50">
                <div className="text-gray-800 text-sm whitespace-pre-wrap">{n.message}</div>
                <div className="text-xs text-gray-500 mt-1">{new Date(n.createdAt).toLocaleString()}</div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default NotificationsPage;
