import React, { useState, useEffect, useCallback } from 'react';
import ChatList from './shared/ChatList';
import ChatHeader from './shared/ChatHeader';
import MessageList from './shared/MessageList';
import MessageComposer from './shared/MessageComposer';
import TeamCreationModal from './shared/TeamCreationModal';
import api from '../../services/apiService';
import socketService from '../../services/socketService';

const AdminBroadCast = () => {
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileChatList, setShowMobileChatList] = useState(false);
  const [groups, setGroups] = useState([]);
  const [broadcasts, setBroadcasts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [currentGroupId, setCurrentGroupId] = useState(null);

  // Initialize socket connection on component mount
  useEffect(() => {
    console.log('🔌 AdminBroadCast: Initializing socket connection...');
    const socket = socketService.connect();
    
    if (socket) {
      console.log('✅ AdminBroadCast: Socket service initialized');
    } else {
      console.error('❌ AdminBroadCast: Failed to initialize socket service');
    }

    // Add connection monitoring
    const connectionCheck = setInterval(() => {
      if (socketService.socket) {
        console.log('🔍 AdminBroadCast: Socket status:', {
          connected: socketService.isConnected,
          id: socketService.socket.id,
          transport: socketService.socket?.io?.engine?.transport?.name
        });
      }
    }, 10000); // Check every 10 seconds

    // Make test function globally available for debugging
    window.testBroadcast = () => {
      console.log('🧪 Testing broadcast functionality...');
      socketService.testConnection();
      if (selectedTeam && selectedTeam.id !== 'all') {
        socketService.sendBroadcast(selectedTeam.id, 'Test message from AdminBroadCast');
      }
    };

    return () => {
      clearInterval(connectionCheck);
      if (currentGroupId) {
        socketService.leaveGroup(currentGroupId);
      }
      // Don't disconnect socket here as it might be used by other components
    };
  }, [currentGroupId, selectedTeam]);

  // Fetch groups and broadcasts on component mount
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setIsLoading(true);
        console.log('🔄 AdminBroadCast: Fetching groups...');
        
        let response;
        let groupsData = [];
        
        try {
          console.log('🔄 AdminBroadCast: Trying GET /groups');
          response = await api.get('/groups');
          groupsData = response.data?.groups || response.data?.data || response.data || [];
          console.log('✅ AdminBroadCast: Successfully fetched groups from /groups:', groupsData);
        } catch (err1) {
          console.log('❌ AdminBroadCast: GET /groups failed:', err1.response?.status);
          
          try {
            console.log('🔄 AdminBroadCast: Trying GET /teams');
            response = await api.get('/teams');
            groupsData = response.data?.teams || response.data?.data || response.data || [];
            console.log('✅ AdminBroadCast: Successfully fetched groups from /teams:', groupsData);
          } catch (err2) {
            console.log('❌ AdminBroadCast: GET /teams failed:', err2.response?.status);
            
            try {
              console.log('🔄 AdminBroadCast: Trying GET /auth/teams');
              response = await api.get('/auth/teams');
              groupsData = response.data?.users || response.data?.teams || response.data?.data || response.data || [];
              console.log('✅ AdminBroadCast: Successfully fetched groups from /auth/teams:', groupsData);
            } catch (err3) {
              console.log('❌ AdminBroadCast: All group endpoints failed', err3.response?.status);
              groupsData = [];
            }
          }
        }
        
        console.log('📊 AdminBroadCast: Processing groups data:', groupsData);
        
        // Add "All" option at the beginning
        const allGroups = [
          { id: 'all', name: 'All Groups', members: [], lastMessage: '', time: '' },
          ...groupsData.map(group => ({
            ...group,
            id: group._id || group.id,
            name: group.name || group.groupName || group.title || 'Unnamed Group',
            members: group.members || group.users || [],
            lastMessage: '', // We'll populate this from broadcasts
            time: ''
          }))
        ];
        
        console.log('📊 AdminBroadCast: Final processed groups:', allGroups);
        setGroups(allGroups);
        // Don't set selectedTeam here to avoid dependency issue
      } catch (err) {
        setError(err);
        console.error('❌ AdminBroadCast: Error fetching groups:', err);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchBroadcasts = async () => {
      try {
        // We'll fetch broadcasts per group when a group is selected
        // For initial load, keep broadcasts empty
        console.log('📊 AdminBroadCast: Initial broadcasts set to empty');
        setBroadcasts([]);
      } catch (err) {
        console.error('❌ AdminBroadCast: Error fetching broadcasts:', err);
      }
    };

    fetchGroups();
    fetchBroadcasts();
  }, []);

  // Set initial selected team when groups are loaded
  useEffect(() => {
    if (groups.length > 0 && !selectedTeam) {
      setSelectedTeam(groups[0]);
    }
  }, [groups, selectedTeam]);

  // Socket event listeners for real-time messaging
  useEffect(() => {
    console.log('🔌 AdminBroadCast: Setting up socket event listeners...');

    // Listen for incoming broadcasts
    const handleBroadcastReceived = (data) => {
      console.log('📨 AdminBroadCast: Received broadcast:', data);
      
      const newBroadcast = {
        _id: data.id || data._id || Date.now(),
        message: data.message || data.text || '',
        group: data.groupId || data.group,
        createdBy: data.createdBy || data.sender || { name: 'Admin' },
        createdAt: data.createdAt || data.timestamp || new Date().toISOString(),
        status: 'received'
      };

      setBroadcasts(prev => [...prev, newBroadcast]);
      
      // Update group's last message if it's for the current group
      if (data.groupId === currentGroupId) {
        setGroups(prevGroups => 
          prevGroups.map(group => 
            group.id === data.groupId 
              ? { 
                  ...group, 
                  lastMessage: (data.message || '').substring(0, 50) + '...', 
                  time: formatTime(newBroadcast.createdAt) 
                }
              : group
          )
        );
      }
    };

    // Listen for group messages response
    const handleGroupMessages = (data) => {
      console.log('📥 AdminBroadCast: Received group messages:', data);
      
      if (data.groupId === currentGroupId) {
        const messages = data.messages || data.broadcasts || [];
        const formattedMessages = messages.map(msg => ({
          _id: msg.id || msg._id || Date.now(),
          message: msg.message || msg.text || '',
          group: msg.groupId || msg.group || data.groupId,
          createdBy: msg.createdBy || msg.sender || { name: 'Admin' },
          createdAt: msg.createdAt || msg.timestamp || new Date().toISOString(),
          status: 'sent'
        }));
        
        setBroadcasts(formattedMessages);
      }
    };

    // Listen for successful broadcast sent confirmation
    const handleBroadcastSent = (data) => {
      console.log('✅ AdminBroadCast: Broadcast sent confirmation:', data);
      if (data.success && data.broadcast) {
        const newBroadcast = {
          _id: data.broadcast.id || Date.now(),
          message: data.broadcast.message,
          group: data.broadcast.groupId,
          createdBy: data.broadcast.createdBy || { name: 'Admin' },
          createdAt: data.broadcast.createdAt || new Date().toISOString(),
          status: 'sent'
        };
        
        setBroadcasts(prev => [...prev, newBroadcast]);
      }
    };

    // Set up event listeners
    socketService.onBroadcastReceived(handleBroadcastReceived);
    socketService.onGroupMessages(handleGroupMessages);
    socketService.onBroadcastSent(handleBroadcastSent);

    // Cleanup
    return () => {
      socketService.offBroadcastReceived(handleBroadcastReceived);
      socketService.offGroupMessages(handleGroupMessages);
      // Note: no offBroadcastSent method in our service, using generic off
    };
  }, [currentGroupId]);

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Fetch broadcasts when selected team changes (using Socket.IO)
  useEffect(() => {
    const fetchBroadcastsForGroup = async (groupId) => {
      try {
        console.log('🔄 AdminBroadCast: Fetching broadcasts for group via socket:', groupId);
        
        if (groupId === 'all') {
          console.log('👥 AdminBroadCast: Selected "All Groups", showing empty broadcasts');
          setBroadcasts([]);
          return;
        }
        
        // Leave previous group if any
        if (currentGroupId && currentGroupId !== groupId) {
          socketService.leaveGroup(currentGroupId);
        }
        
        // Join new group
        socketService.joinGroup(groupId);
        setCurrentGroupId(groupId);
        
        // Request group messages
        socketService.getGroupMessages(groupId);
        
      } catch (err) {
        console.error('❌ AdminBroadCast: Error in fetchBroadcastsForGroup:', err);
        setBroadcasts([]);
      }
    };

    if (selectedTeam) {
      fetchBroadcastsForGroup(selectedTeam.id);
    }
  }, [selectedTeam, currentGroupId]);

  // Convert messages to format expected by MessageList
  const formatMessages = () => {
    console.log('🔄 AdminBroadCast: Formatting messages for display:', broadcasts);
    
    return broadcasts.map(broadcast => ({
      id: broadcast._id || broadcast.id,
      text: broadcast.message || broadcast.text || broadcast.content || '',
      time: formatTime(broadcast.createdAt || broadcast.timestamp || broadcast.date),
      sender: broadcast.createdBy?.name || broadcast.sender?.name || broadcast.author || 'Admin',
      status: 'sent',
      seen: true,
      isOwn: true,
      seenCount: broadcast.recipientCount || broadcast.seenCount || 0
    }));
  };

  const filteredTeams = groups.filter(team =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const messages = formatMessages();

  // Function to handle sending new messages
  const handleSendMessage = async (messageText) => {
    if (!selectedTeam || selectedTeam.id === 'all' || !messageText.trim()) {
      console.log('❌ AdminBroadCast: Cannot send message - invalid conditions:', {
        selectedTeam: selectedTeam?.id,
        messageText: messageText?.trim()
      });
      return;
    }

    try {
      console.log('� AdminBroadCast: Sending message via socket:', messageText.trim());
      
      // Use socket to send broadcast message
      socketService.sendBroadcast(selectedTeam.id, messageText.trim());
      
      console.log('✅ AdminBroadCast: Message sent successfully via socket');
      
    } catch (err) {
      console.error('❌ AdminBroadCast: Error sending message via socket:', err);
    }
  };

  const handleTeamSelect = (team) => {
    setSelectedTeam(team);
    setShowMobileChatList(false); // Close chat list on mobile after selection
  };

  const handleAddTeam = () => {
    setShowTeamModal(true);
  };

  const handleTeamCreated = (newTeam) => {
    // Add the new team to the groups list
    const formattedTeam = {
      ...newTeam,
      id: newTeam._id,
      lastMessage: '',
      time: ''
    };
    setGroups(prev => [...prev, formattedTeam]);
    setSelectedTeam(formattedTeam);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          Error loading data: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-4 p-4 h-full max-h-full overflow-hidden items-start">
      {/* Desktop: Always show ChatList */}
      <div className="hidden md:block h-full ">
        <ChatList
          teams={filteredTeams}
          selectedTeam={selectedTeam}
          onTeamSelect={handleTeamSelect}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          showAddButton={true}
          selectedStyle="bg-[var(--blue100)]"
          onAddTeam={handleAddTeam}
        />
      </div>

      {/* Mobile: Show either ChatList OR Chat Interface */}
      <div className="md:hidden w-full h-full">
        {showMobileChatList ? (
          /* Mobile Chat List */
          <div className="h-full bg-white rounded-lg flex flex-col">
            <ChatList
              teams={filteredTeams}
              selectedTeam={selectedTeam}
              onTeamSelect={handleTeamSelect}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              showAddButton={true}
              selectedStyle="bg-[var(--blue100)]"
              onClose={() => setShowMobileChatList(false)}
              isMobile={true}
              onAddTeam={handleAddTeam}
            />
          </div>
        ) : (
          /* Mobile Chat Interface */
          <div className="flex-1 min-w-0 bg-white rounded-lg flex flex-col h-full overflow-hidden">
            <ChatHeader
              teamName={selectedTeam?.name || 'Select a group'}
              showActiveCount={selectedTeam && selectedTeam.id !== 'all'}
              activeCount={selectedTeam?.members?.length || 0}
              onMenuClick={() => setShowMobileChatList(true)}
              showBackButton={true} // ✅ Always show when in chat view
            />

            <MessageList messages={messages} showSeenIndicators={true} />
            <MessageComposer 
              onSendMessage={handleSendMessage} 
              disabled={!selectedTeam || selectedTeam.id === 'all'} 
              placeholder={selectedTeam?.id === 'all' ? 'Select a specific group to send broadcasts' : 'Type your broadcast message...'}
            />
          </div>
        )}
      </div>


      {/* Desktop: Chat Interface */}
      <div className="hidden md:flex flex-1 min-w-0 bg-white rounded-lg flex-col h-11/12 overflow-hidden">
        <ChatHeader
          teamName={selectedTeam?.name || 'Select a group'}
          showActiveCount={selectedTeam && selectedTeam.id !== 'all'}
          activeCount={selectedTeam?.members?.length || 0}
        />

        <MessageList
          messages={messages}
          showSeenIndicators={true}
        />

        <MessageComposer
          onSendMessage={handleSendMessage}
          disabled={!selectedTeam || selectedTeam.id === 'all'}
          placeholder={selectedTeam?.id === 'all' ? 'Select a specific group to send broadcasts' : 'Type your broadcast message...'}
        />
      </div>
      
      {/* Team Creation Modal */}
      <TeamCreationModal
        isOpen={showTeamModal}
        onClose={() => setShowTeamModal(false)}
        onTeamCreated={handleTeamCreated}
      />
    </div>
  );
};

export default AdminBroadCast;
