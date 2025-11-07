import React, { useEffect, useState } from 'react';
import ChatList from './broadcast-shared/ChatList';
import ChatHeader from './broadcast-shared/ChatHeader';
import MessageList from './broadcast-shared/MessageList';
import api from '../services/apiService';
import socketService from '../services/socketService';

const UserBroadCast = () => {
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teams, setTeams] = useState([]);
  const [messages, setMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showChatList, setShowChatList] = useState(false); // Mobile menu state

  const filteredTeams = teams.filter(team => team.name?.toLowerCase().includes(searchQuery.toLowerCase()));

  // Fetch teams for the user
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const response = await api.get('/auth/teams');
        const list = response.data?.data || response.data || [];
        const normalized = (list || []).map(t => ({ id: t._id || t.id || t.groupId || t.name, name: t.name || t.groupName || String(t) }));
        if (isMounted) {
          setTeams(normalized);
          if (normalized.length > 0) {
            setSelectedTeam(normalized[0]);
          }
        }
      } catch (err) {
        console.warn('UserBroadCast: Failed to load teams', err);
        setTeams([]);
      }
    })();
    return () => { isMounted = false; };
  }, []);

  // Join team room and load messages when team changes
  useEffect(() => {
    if (!selectedTeam?.id) return;
    const gid = selectedTeam.id;
    // Join group and request messages
    socketService.joinGroup(gid);
    socketService.getGroupMessages(gid);

    const handleGroupMessages = (payload) => {
      // Expecting payload like { groupId, messages: [...] }
      const arr = payload?.messages || payload || [];
      const normalized = arr.map((m, idx) => ({
        id: m._id || m.id || idx,
        text: m.text || m.message || '',
        time: m.time || m.createdAt || '',
        isOwn: false,
      }));
      setMessages(normalized);
    };

    socketService.onGroupMessages(handleGroupMessages);
    return () => {
      socketService.offGroupMessages(handleGroupMessages);
      socketService.leaveGroup(gid);
    };
  }, [selectedTeam?.id]);

  return (
    <div className="flex gap-4 p-4 h-full max-h-full overflow-hidden items-start">
      {/* Mobile Overlay */}
      {showChatList && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setShowChatList(false)}
        />
      )}

      {/* ChatList - Responsive */}
      <div className={`
        fixed md:relative z-50 md:z-auto top-0 left-0 h-full md:h-auto
        w-96 md:w-auto
        transform md:transform-none transition-transform duration-300 ease-in-out
        ${showChatList ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        md:block
      `}>
        <ChatList
          teams={filteredTeams}
          selectedTeam={selectedTeam?.id}
          onTeamSelect={(team) => {
            setSelectedTeam(team);
            setShowChatList(false);
          }}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          showAddButton={false}
          selectedStyle="bg-blue-50"
          onClose={() => setShowChatList(false)}
        />
      </div>

      <div className="flex-1 min-w-0 bg-white rounded-lg flex flex-col overflow-hidden">
        <ChatHeader
          teamName={selectedTeam?.name || 'Broadcast'}
          showActiveCount={true}
          activeCount={4}
          onMenuClick={() => setShowChatList(true)}
        />

        <MessageList messages={messages} />
        
        {/* No MessageComposer for users - they can't send messages */}
      </div>
    </div>
  );
};

export default UserBroadCast;
