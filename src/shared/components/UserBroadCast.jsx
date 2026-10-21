import React, { useEffect, useState, useRef } from 'react';
import ChatList from './broadcast-shared/ChatList';
import ChatHeader from './broadcast-shared/ChatHeader';
import MessageList from './broadcast-shared/MessageList';
import MessageComposer from './broadcast-shared/MessageComposer';
import api from '../services/apiService';
import socketService from '../services/socketService';

const UserBroadCast = () => {
  const [selectedTeam, setSelectedTeam] = useState(null); // represents a group/user object
  const [teams, setTeams] = useState([]); // list of selectable groups
  const [messages, setMessages] = useState([]);
  const [showInfo, setShowInfo] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showChatList, setShowChatList] = useState(false); // Mobile menu state
  const historyLoadedRef = useRef(false);

  const filteredTeams = teams.filter(team => team.name?.toLowerCase().includes(searchQuery.toLowerCase()));

  // Fetch groups strictly from /groups (authoritative group list)
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const resp = await api.get('/groups');
        const list = resp?.data?.groups || resp?.data?.data || [];
        console.debug('UserBroadCast: /groups response', resp?.data);
        const fmtTime = (d) => {
          if (!d) return '';
          try {
            const dt = new Date(d);
            const now = new Date();
            const isSameDay = dt.getFullYear() === now.getFullYear() && dt.getMonth() === now.getMonth() && dt.getDate() === now.getDate();
            if (isSameDay) {
              // 12-hour time with AM/PM
              return dt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
            }
            // Not today -> show date label (e.g., Nov 10 or Nov 10, 2024 if different year)
            const opts = { month: 'short', day: 'numeric' };
            if (dt.getFullYear() !== now.getFullYear()) opts['year'] = 'numeric';
            return dt.toLocaleDateString('en-US', opts);
          } catch {
            return '';
          }
        };

        const normalized = (list || []).map(g => ({
          _id: g._id,
          id: g._id,
          name: g.name || 'Group',
          members: g.members || [],
          lastMessage: g.latestBroadcast?.message ?? g.lastMessage ?? '',
          time: fmtTime(g.latestBroadcast?.createdAt ?? g.time),
        }));
        if (isMounted) {
          setTeams(normalized);
          setSelectedTeam(normalized[0] || null);
        }
      } catch (err) {
        console.warn('UserBroadCast: Failed to load groups', err);
        if (isMounted) {
          setTeams([]);
          setSelectedTeam(null);
        }
      }
    })();
    return () => { isMounted = false; };
  }, []);

  // Join group, load messages via socket + immediate HTTP fetch (admin-like behavior)
  useEffect(() => {
    const gid = selectedTeam?._id || selectedTeam?.id;
    if (!gid) { setMessages([]); return; }

    let active = true;
    historyLoadedRef.current = false;

    // current user id (used to mark ownership)
    let currentUserId = null;
    try { const ui = JSON.parse(localStorage.getItem('userInfo') || '{}'); currentUserId = ui.id || ui._id || ui.userId || null; } catch { currentUserId = null; }

    const normalizeArr = (arr = []) => (arr || []).map((m, idx) => ({
      id: m._id || m.id || idx,
      text: m.message || m.text || m.body || '',
      time: m.createdAt || m.time || '',
      isOwn: Boolean(m.createdBy && (String(m.createdBy._id || m.createdBy.id) === String(currentUserId))),
    }));

    const logPrefix = `[UserBroadCast:${gid}]`;
    const log = (...args) => console.debug(logPrefix, ...args);

    // Socket join + request history
    try {
      socketService.joinGroup(gid);
      try { socketService.getGroupMessages(gid); } catch { /* ignore */ }
      log('joined group & requested socket history');
    } catch (e) {
      console.error(logPrefix, 'join/getGroupMessages error', e);
    }

    // Immediate HTTP history attempt (primary API used by admin)
    (async () => {
      try {
        const r = await api.get(`/broadcasts/${gid}`);
        console.debug(`${logPrefix} HTTP /broadcasts/:id response:`, r?.data);
        const arr = r.data?.broadcasts || r.data?.messages || r.data?.data || [];
        if (Array.isArray(arr) && arr.length) {
          if (!active) return;
          setMessages(normalizeArr(arr));
          historyLoadedRef.current = true;
          log('HTTP history loaded from /broadcasts/:id count:', arr.length);
          return;
        }
      } catch (err) {
        console.debug(`${logPrefix} /broadcasts/:id fetch failed:`, err?.response?.status || err?.message || err);
      }
    })();

    // Live message handler (append)
    const onLiveMessage = (evt) => {
      if (!active) return;
      const evtGroup = evt?.groupId || evt?.group || evt?.roomId;
      if (String(evtGroup || gid) !== String(gid)) return;
      const msg = {
        id: evt._id || evt.id || Date.now(),
        text: evt.message || evt.text || evt.body || '',
        time: evt.createdAt || evt.time || new Date().toISOString(),
        isOwn: Boolean(evt.createdBy && (String(evt.createdBy._id || evt.createdBy.id) === String(currentUserId))),
      };
      setMessages(prev => [...prev, msg]);
      historyLoadedRef.current = true;
      log('live message appended');
    };

    // Socket history handler (replace)
    const onHistory = (payload) => {
      if (!active) return;
      const arr = payload?.broadcasts || payload?.messages || payload || [];
      setMessages(normalizeArr(arr));
      historyLoadedRef.current = true;
      log('socket history received', Array.isArray(arr) ? arr.length : 0);
    };

    socketService.on('broadcast_received', onLiveMessage);
    socketService.on('group_messages', onHistory);
    socketService.on('group_history', onHistory);

    return () => {
      active = false;
      socketService.off('broadcast_received', onLiveMessage);
      socketService.off('group_messages', onHistory);
      socketService.off('group_history', onHistory);
      try { socketService.leaveGroup(gid); } catch { /* ignore */ }
      log('cleanup');
    };
  }, [selectedTeam]);

  return (
    <div className="flex gap-4 overflow-hidden items-start">
      {/* Mobile Overlay */}
      {showChatList && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setShowChatList(false)}
        />
      )}

      {/* ChatList - Responsive */}
      <div className={`
        fixed md:relative z-50 md:z-auto top-0 left-0 h-full md:h-[80vh]
        w-96 md:w-auto
        transform md:transform-none transition-transform duration-300 ease-in-out
        ${showChatList ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        md:block
      `}>
        <ChatList
          teams={filteredTeams}
          selectedTeam={selectedTeam}
          onTeamSelect={(teamObj) => {
            setSelectedTeam(teamObj);
            setShowChatList(false);
          }}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          showAddButton={false}
          selectedStyle="bg-blue-50"
          onClose={() => setShowChatList(false)}
        />
      </div>

      <div className="flex-1 min-w-0 bg-white rounded-lg flex flex-col overflow-hidden h-[80vh]">
        <ChatHeader
          teamName={selectedTeam?.name || 'Broadcast'}
          showActiveCount={false}
          activeCount={messages.length}
          onMenuClick={() => setShowChatList(true)}
          onInfoClick={() => setShowInfo(true)}
        />

        <MessageList
          messages={messages}
          bubbleTone="user"
        />

        {/* Message Composer for users */}
        <MessageComposer
          onSendMessage={(text) => {
            const gid = selectedTeam?._id || selectedTeam?.id;
            if (gid && text.trim()) {
              socketService.sendBroadcast(gid, text.trim());
            }
          }}
          disabled={!selectedTeam}
          placeholder="Type your message..."
        />
      </div>
      {showInfo && selectedTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowInfo(false)}></div>
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6 max-h-[80vh] flex flex-col">
            <h2 className="text-lg font-semibold mb-2">Group Members</h2>
            <p className="text-sm text-gray-500 mb-4">{selectedTeam.name}</p>
            <div className="flex-1 overflow-y-auto pr-2 space-y-2">
              {(selectedTeam.members || []).map(m => (
                <div key={m._id || m.id} className="flex items-center justify-between border rounded-md px-3 py-2 bg-gray-50">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{m.name}</p>
                    <p className="text-xs text-gray-500">{m.email}</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-200 text-gray-600 uppercase">{m.role || 'user'}</span>
                </div>
              ))}
              {(!selectedTeam.members || selectedTeam.members.length === 0) && (
                <div className="text-sm text-gray-400">No members listed.</div>
              )}
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowInfo(false)}
                className="px-4 py-2 text-sm rounded-md bg-gray-800 text-white hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserBroadCast;
