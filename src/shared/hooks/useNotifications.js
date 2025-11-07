import { useEffect, useRef, useState } from 'react';
import { useAuth } from './useAuth';
import api from '../services/apiService';
import socketService from '../services/socketService';

// Production-ready notifications hook:
// - One-time REST fetch for initial list
// - Live updates via socket.io (no polling)
// - Dedupe by _id and cap list size
export function useNotifications() {
  const { user } = useAuth();
  const userId = user?._id || user?.id || user?.userId;
  const role = user?.role || (user?.isAdmin ? 'admin' : 'user');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const seenIdsRef = useRef(new Set());

  // Initial fetch
  useEffect(() => {
    let active = true;
    async function load() {
      if (!userId) return;
      setLoading(true); setError(null);
      try {
        const resp = await api.get('/notifications');
        const list = Array.isArray(resp?.data?.data) ? resp.data.data : [];
        if (!active) return;
        const ids = new Set();
        const normalized = list.map(n => {
          const _id = n._id || n.id || `tmp-${Date.now()}`;
          ids.add(_id);
          return {
            _id,
            type: n.type || 'Lead',
            itemId: n.leadId || n.itemId,
            message: n.message || n.title || 'Notification',
            category: n.category || 'general',
            createdAt: n.createdAt || new Date().toISOString(),
          };
        });
        seenIdsRef.current = ids;
        setNotifications(normalized);
      } catch (e) {
        if (!active) return;
        setError(e);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, [userId]);

  // Live updates via socket.io
  useEffect(() => {
    if (!userId) return;
    // Ensure socket is connected and register this user (idempotent across reconnects)
    socketService.connect();
    socketService.registerUserWith({ userId, role });

    const onFollow = (data) => {
      const id = data?._id || data?.id || `tmp-${Date.now()}`;
      if (seenIdsRef.current.has(id)) return;
      seenIdsRef.current.add(id);
      setNotifications(prev => {
        const next = [{
          _id: id,
          type: data?.type || 'Lead',
          itemId: data?.leadId || data?.itemId,
          message: data?.message || data?.title || 'Notification',
          category: data?.category || 'general',
          createdAt: data?.createdAt || new Date().toISOString(),
        }, ...prev];
        if (next.length > 300) next.length = 300; // cap
        return next;
      });
    };

    socketService.on('followup_notification', onFollow);
    return () => {
      try { socketService.off('followup_notification', onFollow); } catch (e) { void e; }
    };
  }, [userId, role]);

  return { notifications, loading, error };
}

export default useNotifications;
