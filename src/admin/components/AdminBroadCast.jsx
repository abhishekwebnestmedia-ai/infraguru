// import React, { useState, useEffect, useCallback } from 'react';
// import ChatList from './shared/ChatList';
// import ChatHeader from './shared/ChatHeader';
// import MessageList from './shared/MessageList';
// import MessageComposer from './shared/MessageComposer';
// import TeamCreationModal from './shared/TeamCreationModal';
// import api from '../../services/apiService';
// import socketService from '../../services/socketService';

// const AdminBroadCast = () => {
//   const [selectedTeam, setSelectedTeam] = useState(null);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [showMobileChatList, setShowMobileChatList] = useState(false);
//   const [groups, setGroups] = useState([]);
//   const [broadcasts, setBroadcasts] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [showTeamModal, setShowTeamModal] = useState(false);
//   const [currentGroupId, setCurrentGroupId] = useState(null);

//   // Initialize socket connection on component mount
//   useEffect(() => {
//     console.log('🔌 AdminBroadCast: Initializing socket connection...');
//     const socket = socketService.connect();
    
//     if (socket) {
//       console.log('✅ AdminBroadCast: Socket service initialized');
//     } else {
//       console.error('❌ AdminBroadCast: Failed to initialize socket service');
//     }

//     // Add connection monitoring
//     const connectionCheck = setInterval(() => {
//       if (socketService.socket) {
//         console.log('🔍 AdminBroadCast: Socket status:', {
//           connected: socketService.isConnected,
//           id: socketService.socket.id,
//           transport: socketService.socket?.io?.engine?.transport?.name
//         });
//       }
//     }, 10000); // Check every 10 seconds

//     // Make test function globally available for debugging
//     window.testBroadcast = () => {
//       console.log('🧪 Testing broadcast functionality...');
//       socketService.testConnection();
//       if (selectedTeam && selectedTeam.id !== 'all') {
//         socketService.sendBroadcast(selectedTeam.id, 'Test message from AdminBroadCast');
//       }
//     };

//     return () => {
//       clearInterval(connectionCheck);
//       if (currentGroupId) {
//         socketService.leaveGroup(currentGroupId);
//       }
//       // Don't disconnect socket here as it might be used by other components
//     };
//   }, [currentGroupId, selectedTeam]);

//   // Fetch groups and broadcasts on component mount
//   useEffect(() => {
//     const fetchGroups = async () => {
//       try {
//         setIsLoading(true);
//         console.log('🔄 AdminBroadCast: Fetching groups...');
        
//         let response;
//         let groupsData = [];
        
//         try {
//           console.log('🔄 AdminBroadCast: Trying GET /groups');
//           response = await api.get('/groups');
//           groupsData = response.data?.groups || response.data?.data || response.data || [];
//           console.log('✅ AdminBroadCast: Successfully fetched groups from /groups:', groupsData);
//         } catch (err1) {
//           console.log('❌ AdminBroadCast: GET /groups failed:', err1.response?.status);
          
//           try {
//             console.log('🔄 AdminBroadCast: Trying GET /teams');
//             response = await api.get('/teams');
//             groupsData = response.data?.teams || response.data?.data || response.data || [];
//             console.log('✅ AdminBroadCast: Successfully fetched groups from /teams:', groupsData);
//           } catch (err2) {
//             console.log('❌ AdminBroadCast: GET /teams failed:', err2.response?.status);
            
//             try {
//               console.log('🔄 AdminBroadCast: Trying GET /auth/teams');
//               response = await api.get('/auth/teams');
//               groupsData = response.data?.users || response.data?.teams || response.data?.data || response.data || [];
//               console.log('✅ AdminBroadCast: Successfully fetched groups from /auth/teams:', groupsData);
//             } catch (err3) {
//               console.log('❌ AdminBroadCast: All group endpoints failed', err3.response?.status);
//               groupsData = [];
//             }
//           }
//         }
        
//         console.log('📊 AdminBroadCast: Processing groups data:', groupsData);
        
//         // Add "All" option at the beginning
//         const allGroups = [
//           { id: 'all', name: 'All Groups', members: [], lastMessage: '', time: '' },
//           ...groupsData.map(group => ({
//             ...group,
//             id: group._id || group.id,
//             name: group.name || group.groupName || group.title || 'Unnamed Group',
//             members: group.members || group.users || [],
//             lastMessage: '', // We'll populate this from broadcasts
//             time: ''
//           }))
//         ];
        
//         console.log('📊 AdminBroadCast: Final processed groups:', allGroups);
//         setGroups(allGroups);
//         // Don't set selectedTeam here to avoid dependency issue
//       } catch (err) {
//         setError(err);
//         console.error('❌ AdminBroadCast: Error fetching groups:', err);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     const fetchBroadcasts = async () => {
//       try {
//         // We'll fetch broadcasts per group when a group is selected
//         // For initial load, keep broadcasts empty
//         console.log('📊 AdminBroadCast: Initial broadcasts set to empty');
//         setBroadcasts([]);
//       } catch (err) {
//         console.error('❌ AdminBroadCast: Error fetching broadcasts:', err);
//       }
//     };

//     fetchGroups();
//     fetchBroadcasts();
//   }, []);

//   // Set initial selected team when groups are loaded
//   useEffect(() => {
//     if (groups.length > 0 && !selectedTeam) {
//       setSelectedTeam(groups[0]);
//     }
//   }, [groups, selectedTeam]);

//   // Socket event listeners for real-time messaging
//   useEffect(() => {
//     console.log('🔌 AdminBroadCast: Setting up socket event listeners...');

//     // Listen for incoming broadcasts
//     const handleBroadcastReceived = (data) => {
//       console.log('📨 AdminBroadCast: Received broadcast:', data);
      
//       const newBroadcast = {
//         _id: data.id || data._id || Date.now(),
//         message: data.message || data.text || '',
//         group: data.groupId || data.group,
//         createdBy: data.createdBy || data.sender || { name: 'Admin' },
//         createdAt: data.createdAt || data.timestamp || new Date().toISOString(),
//         status: 'received'
//       };

//       setBroadcasts(prev => [...prev, newBroadcast]);
      
//       // Update group's last message if it's for the current group
//       if (data.groupId === currentGroupId) {
//         setGroups(prevGroups => 
//           prevGroups.map(group => 
//             group.id === data.groupId 
//               ? { 
//                   ...group, 
//                   lastMessage: (data.message || '').substring(0, 50) + '...', 
//                   time: formatTime(newBroadcast.createdAt) 
//                 }
//               : group
//           )
//         );
//       }
//     };

//     // Listen for group messages response
//     const handleGroupMessages = (data) => {
//       console.log('📥 AdminBroadCast: Received group messages:', data);
      
//       if (data.groupId === currentGroupId) {
//         const messages = data.messages || data.broadcasts || [];
//         const formattedMessages = messages.map(msg => ({
//           _id: msg.id || msg._id || Date.now(),
//           message: msg.message || msg.text || '',
//           group: msg.groupId || msg.group || data.groupId,
//           createdBy: msg.createdBy || msg.sender || { name: 'Admin' },
//           createdAt: msg.createdAt || msg.timestamp || new Date().toISOString(),
//           status: 'sent'
//         }));
        
//         setBroadcasts(formattedMessages);
//       }
//     };

//     // Listen for successful broadcast sent confirmation
//     const handleBroadcastSent = (data) => {
//       console.log('✅ AdminBroadCast: Broadcast sent confirmation:', data);
//       if (data.success && data.broadcast) {
//         const newBroadcast = {
//           _id: data.broadcast.id || Date.now(),
//           message: data.broadcast.message,
//           group: data.broadcast.groupId,
//           createdBy: data.broadcast.createdBy || { name: 'Admin' },
//           createdAt: data.broadcast.createdAt || new Date().toISOString(),
//           status: 'sent'
//         };
        
//         setBroadcasts(prev => [...prev, newBroadcast]);
//       }
//     };

//     // Set up event listeners
//     socketService.onBroadcastReceived(handleBroadcastReceived);
//     socketService.onGroupMessages(handleGroupMessages);
//     socketService.onBroadcastSent(handleBroadcastSent);

//     // Cleanup
//     return () => {
//       socketService.offBroadcastReceived(handleBroadcastReceived);
//       socketService.offGroupMessages(handleGroupMessages);
//       // Note: no offBroadcastSent method in our service, using generic off
//     };
//   }, [currentGroupId]);

//   const formatTime = (dateString) => {
//     return new Date(dateString).toLocaleTimeString('en-US', {
//       hour: '2-digit',
//       minute: '2-digit',
//       hour12: true
//     });
//   };

//   // Fetch broadcasts when selected team changes (using Socket.IO)
//   useEffect(() => {
//     const fetchBroadcastsForGroup = async (groupId) => {
//       try {
//         console.log('🔄 AdminBroadCast: Fetching broadcasts for group via socket:', groupId);
        
//         if (groupId === 'all') {
//           console.log('👥 AdminBroadCast: Selected "All Groups", showing empty broadcasts');
//           setBroadcasts([]);
//           return;
//         }
        
//         // Leave previous group if any
//         if (currentGroupId && currentGroupId !== groupId) {
//           socketService.leaveGroup(currentGroupId);
//         }
        
//         // Join new group
//         socketService.joinGroup(groupId);
//         setCurrentGroupId(groupId);
        
//         // Request group messages
//         socketService.getGroupMessages(groupId);
        
//       } catch (err) {
//         console.error('❌ AdminBroadCast: Error in fetchBroadcastsForGroup:', err);
//         setBroadcasts([]);
//       }
//     };

//     if (selectedTeam) {
//       fetchBroadcastsForGroup(selectedTeam.id);
//     }
//   }, [selectedTeam, currentGroupId]);

//   // Convert messages to format expected by MessageList
//   const formatMessages = () => {
//     console.log('🔄 AdminBroadCast: Formatting messages for display:', broadcasts);
    
//     return broadcasts.map(broadcast => ({
//       id: broadcast._id || broadcast.id,
//       text: broadcast.message || broadcast.text || broadcast.content || '',
//       time: formatTime(broadcast.createdAt || broadcast.timestamp || broadcast.date),
//       sender: broadcast.createdBy?.name || broadcast.sender?.name || broadcast.author || 'Admin',
//       status: 'sent',
//       seen: true,
//       isOwn: true,
//       seenCount: broadcast.recipientCount || broadcast.seenCount || 0
//     }));
//   };

//   const filteredTeams = groups.filter(team =>
//     team.name.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const messages = formatMessages();

//   // Function to handle sending new messages
//   const handleSendMessage = async (messageText) => {
//     if (!selectedTeam || selectedTeam.id === 'all' || !messageText.trim()) {
//       console.log('❌ AdminBroadCast: Cannot send message - invalid conditions:', {
//         selectedTeam: selectedTeam?.id,
//         messageText: messageText?.trim()
//       });
//       return;
//     }

//     try {
//       console.log('� AdminBroadCast: Sending message via socket:', messageText.trim());
      
//       // Use socket to send broadcast message
//       socketService.sendBroadcast(selectedTeam.id, messageText.trim());
      
//       console.log('✅ AdminBroadCast: Message sent successfully via socket');
      
//     } catch (err) {
//       console.error('❌ AdminBroadCast: Error sending message via socket:', err);
//     }
//   };

//   const handleTeamSelect = (team) => {
//     setSelectedTeam(team);
//     setShowMobileChatList(false); // Close chat list on mobile after selection
//   };

//   const handleAddTeam = () => {
//     setShowTeamModal(true);
//   };

//   const handleTeamCreated = (newTeam) => {
//     // Add the new team to the groups list
//     const formattedTeam = {
//       ...newTeam,
//       id: newTeam._id,
//       lastMessage: '',
//       time: ''
//     };
//     setGroups(prev => [...prev, formattedTeam]);
//     setSelectedTeam(formattedTeam);
//   };

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center p-8">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
//           <p className="text-gray-600">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-4">
//         <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
//           Error loading data: {error.message}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex gap-4 p-4 h-full max-h-full overflow-hidden items-start">
//       {/* Desktop: Always show ChatList */}
//       <div className="hidden md:block h-full ">
//         <ChatList
//           teams={filteredTeams}
//           selectedTeam={selectedTeam}
//           onTeamSelect={handleTeamSelect}
//           searchQuery={searchQuery}
//           onSearchChange={setSearchQuery}
//           showAddButton={true}
//           selectedStyle="bg-[var(--blue100)]"
//           onAddTeam={handleAddTeam}
//         />
//       </div>

//       {/* Mobile: Show either ChatList OR Chat Interface */}
//       <div className="md:hidden w-full h-full">
//         {showMobileChatList ? (
//           /* Mobile Chat List */
//           <div className="h-full bg-white rounded-lg flex flex-col">
//             <ChatList
//               teams={filteredTeams}
//               selectedTeam={selectedTeam}
//               onTeamSelect={handleTeamSelect}
//               searchQuery={searchQuery}
//               onSearchChange={setSearchQuery}
//               showAddButton={true}
//               selectedStyle="bg-[var(--blue100)]"
//               onClose={() => setShowMobileChatList(false)}
//               isMobile={true}
//               onAddTeam={handleAddTeam}
//             />
//           </div>
//         ) : (
//           /* Mobile Chat Interface */
//           <div className="flex-1 min-w-0 bg-white rounded-lg flex flex-col h-full overflow-hidden">
//             <ChatHeader
//               teamName={selectedTeam?.name || 'Select a group'}
//               showActiveCount={selectedTeam && selectedTeam.id !== 'all'}
//               activeCount={selectedTeam?.members?.length || 0}
//               onMenuClick={() => setShowMobileChatList(true)}
//               showBackButton={true} // ✅ Always show when in chat view
//             />

//             <MessageList messages={messages} showSeenIndicators={true} />
//             <MessageComposer 
//               onSendMessage={handleSendMessage} 
//               disabled={!selectedTeam || selectedTeam.id === 'all'} 
//               placeholder={selectedTeam?.id === 'all' ? 'Select a specific group to send broadcasts' : 'Type your broadcast message...'}
//             />
//           </div>
//         )}
//       </div>


//       {/* Desktop: Chat Interface */}
//       <div className="hidden md:flex flex-1 min-w-0 bg-white rounded-lg flex-col h-11/12 overflow-hidden">
//         <ChatHeader
//           teamName={selectedTeam?.name || 'Select a group'}
//           showActiveCount={selectedTeam && selectedTeam.id !== 'all'}
//           activeCount={selectedTeam?.members?.length || 0}
//         />

//         <MessageList
//           messages={messages}
//           showSeenIndicators={true}
//         />

//         <MessageComposer
//           onSendMessage={handleSendMessage}
//           disabled={!selectedTeam || selectedTeam.id === 'all'}
//           placeholder={selectedTeam?.id === 'all' ? 'Select a specific group to send broadcasts' : 'Type your broadcast message...'}
//         />
//       </div>
      
//       {/* Team Creation Modal */}
//       <TeamCreationModal
//         isOpen={showTeamModal}
//         onClose={() => setShowTeamModal(false)}
//         onTeamCreated={handleTeamCreated}
//       />
//     </div>
//   );
// };

// export default AdminBroadCast;


// import React, { useState, useEffect, useRef } from 'react';
// import ChatList from './shared/ChatList';
// import ChatHeader from './shared/ChatHeader';
// import MessageList from './shared/MessageList';
// import MessageComposer from './shared/MessageComposer';
// import TeamCreationModal from './shared/TeamCreationModal';
// import api from '../../services/apiService';
// import socketService from '../../services/socketService';

// const AdminBroadCast = () => {
//   const [selectedTeam, setSelectedTeam] = useState(null);
//   const selectedTeamRef = useRef(null);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [showMobileChatList, setShowMobileChatList] = useState(false);
//   const [groups, setGroups] = useState([]);
//   const [broadcasts, setBroadcasts] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [showTeamModal, setShowTeamModal] = useState(false);
//   const [currentGroupId, setCurrentGroupId] = useState(null);

//   // keep ref updated with latest selected team
//   useEffect(() => {
//     selectedTeamRef.current = selectedTeam;
//   }, [selectedTeam]);

//   // -------------------------
//   // 🔌 Socket Initialization
//   // -------------------------
//   useEffect(() => {
//     console.log('🔌 Initializing socket connection...');
//     const socket = socketService.connect();

//     if (socket) {
//       console.log('✅ Socket connected:', socket.id);
//     } else {
//       console.error('❌ Failed to initialize socket service');
//     }

//     const connectionCheck = setInterval(() => {
//       if (socketService.socket) {
//         console.log('🔍 Socket status:', {
//           connected: socketService.isConnected,
//           id: socketService.socket.id,
//           transport: socketService.socket?.io?.engine?.transport?.name,
//         });
//       }
//     }, 10000);

//     window.testBroadcast = () => {
//       const cur = selectedTeamRef.current;
//       const groupId = cur ? (cur._id || cur.id) : null;
//       console.log('🧪 Test broadcast groupId:', groupId);
//       if (groupId && groupId !== 'all') {
//         socketService.sendBroadcast(groupId, 'Test message from AdminBroadCast');
//       } else {
//         console.warn('❌ testBroadcast: No valid group selected');
//       }
//     };

//     return () => {
//       clearInterval(connectionCheck);
//       if (currentGroupId) socketService.leaveGroup(currentGroupId);
//     };
//   }, []); // run once

//   // -------------------------
//   // 📡 Fetch Groups
//   // -------------------------
//   useEffect(() => {
//     const fetchGroups = async () => {
//       try {
//         setIsLoading(true);
//         console.log('🔄 Fetching groups...');
//         const response = await api.get('/groups');
//         const groupsData = response.data?.groups || [];

//         // Normalize structure
//         const allGroups = [
//           { id: 'all', _id: 'all', name: 'All Groups', members: [], lastMessage: '', time: '' },
//           ...groupsData.map(group => ({
//             ...group,
//             _id: group._id || group.id,
//             id: group._id || group.id,
//             name: group.name || 'Unnamed Group',
//             members: group.members || [],
//             lastMessage: '',
//             time: '',
//           })),
//         ];

//         console.log('✅ Groups:', allGroups);
//         setGroups(allGroups);

//         // Default to the first actual group (not "All Groups")
//         if (!selectedTeam && allGroups.length > 1) {
//           setSelectedTeam(allGroups[1]);
//         } else if (!selectedTeam) {
//           setSelectedTeam(allGroups[0]);
//         }
//       } catch (err) {
//         setError(err);
//         console.error('❌ Error fetching groups:', err);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchGroups();
//   }, []);

//   // -------------------------
//   // 🎧 Socket Event Listeners
//   // -------------------------
//   useEffect(() => {
//     const handleBroadcastReceived = (data) => {
//       console.log('📨 Received broadcast:', data);
//       const newBroadcast = {
//         _id: data._id || Date.now(),
//         message: data.message,
//         group: data.groupId,
//         createdBy: data.createdBy || { name: 'Admin' },
//         createdAt: data.createdAt || new Date().toISOString(),
//         status: 'received',
//       };
//       setBroadcasts(prev => [...prev, newBroadcast]);
//     };

//     const handleGroupMessages = (data) => {
//       console.log('📥 Group messages received:', data);
//       const messages = data.messages || data.broadcasts || [];
//       setBroadcasts(messages.map(msg => ({
//         _id: msg._id || Date.now(),
//         message: msg.message,
//         group: msg.groupId || data.groupId,
//         createdBy: msg.createdBy || { name: 'Admin' },
//         createdAt: msg.createdAt || new Date().toISOString(),
//         status: 'sent',
//       })));
//     };

//     const handleBroadcastSent = (data) => {
//       console.log('✅ Broadcast sent confirmation:', data);
//       if (data.success && data.broadcast) {
//         setBroadcasts(prev => [...prev, {
//           _id: data.broadcast._id || Date.now(),
//           message: data.broadcast.message,
//           group: data.broadcast.group || data.broadcast.groupId,
//           createdBy: data.broadcast.createdBy || { name: 'Admin' },
//           createdAt: data.broadcast.createdAt || new Date().toISOString(),
//           status: 'sent',
//         }]);
//       }
//     };

//     socketService.onBroadcastReceived(handleBroadcastReceived);
//     socketService.onGroupMessages(handleGroupMessages);
//     socketService.getSocket()?.on('broadcast_sent', handleBroadcastSent);

//     return () => {
//       socketService.offBroadcastReceived(handleBroadcastReceived);
//       socketService.offGroupMessages(handleGroupMessages);
//       socketService.getSocket()?.off('broadcast_sent', handleBroadcastSent);
//     };
//   }, []);

//   // -------------------------
//   // 📦 Group Joining Logic
//   // -------------------------
//   useEffect(() => {
//     const joinAndFetchGroup = (groupId) => {
//       if (!groupId || groupId === 'all') {
//         console.log('👥 "All Groups" selected, skipping join.');
//         setBroadcasts([]);
//         return;
//       }

//       if (currentGroupId && currentGroupId !== groupId) {
//         console.log('🚪 Leaving previous group:', currentGroupId);
//         socketService.leaveGroup(currentGroupId);
//       }

//       console.log('📦 Joining group:', groupId);
//       socketService.joinGroup(groupId);
//       setCurrentGroupId(groupId);
//       socketService.getGroupMessages(groupId);
//     };

//     if (selectedTeam) {
//       const groupId = selectedTeam._id || selectedTeam.id;
//       joinAndFetchGroup(groupId);
//     }
//   }, [selectedTeam]);

//   // -------------------------
//   // ✉️ Send Message
//   // -------------------------
//   const handleSendMessage = async (messageText) => {
//     const trimmed = (messageText || '').trim();
//     const groupId = selectedTeam ? (selectedTeam._id || selectedTeam.id) : null;

//     if (!groupId || groupId === 'all' || !trimmed) {
//       console.warn('❌ Cannot send message - invalid conditions:', { groupId, messageText: trimmed });
//       return;
//     }

//     try {
//       console.log('📤 Sending broadcast:', { groupId, message: trimmed });
//       socketService.sendBroadcast(groupId, trimmed);
//     } catch (err) {
//       console.error('❌ Error sending message:', err);
//     }
//   };

//   // -------------------------
//   // 🧠 UI Handlers
//   // -------------------------
//   const handleTeamSelect = (team) => {
//     console.log('📌 Selected team object:', team);
//     setSelectedTeam(team);
//     setShowMobileChatList(false);
//   };

//   const handleAddTeam = () => setShowTeamModal(true);

//   const handleTeamCreated = (newTeam) => {
//     const formatted = {
//       ...newTeam,
//       id: newTeam._id,
//       _id: newTeam._id,
//       lastMessage: '',
//       time: '',
//     };
//     setGroups(prev => [...prev, formatted]);
//     setSelectedTeam(formatted);
//   };

//   const formatTime = (dateString) => {
//     try {
//       return new Date(dateString).toLocaleTimeString('en-US', {
//         hour: '2-digit',
//         minute: '2-digit',
//         hour12: true,
//       });
//     } catch {
//       return '';
//     }
//   };

//   const messages = broadcasts.map(broadcast => ({
//     id: broadcast._id || broadcast.id,
//     text: broadcast.message,
//     time: formatTime(broadcast.createdAt),
//     sender: broadcast.createdBy?.name || 'Admin',
//     isOwn: true,
//   }));

//   const filteredTeams = groups.filter(team =>
//     (team.name || '').toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   // -------------------------
//   // 🖥️ Render
//   // -------------------------
//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center p-8">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
//           <p className="text-gray-600">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-4">
//         <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
//           Error loading data: {error.message}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex gap-4 p-4 h-full max-h-full overflow-hidden items-start">
//       {/* Chat List */}
//       <div className="hidden md:block h-full">
//         <ChatList
//           teams={filteredTeams}
//           selectedTeam={selectedTeam}
//           onTeamSelect={handleTeamSelect}
//           searchQuery={searchQuery}
//           onSearchChange={setSearchQuery}
//           showAddButton
//           selectedStyle="bg-[var(--blue100)]"
//           onAddTeam={handleAddTeam}
//         />
//       </div>

//       {/* Chat Interface */}
//       <div className="flex-1 min-w-0 bg-white rounded-lg flex flex-col h-11/12 overflow-hidden">
//         <ChatHeader
//           teamName={selectedTeam?.name || 'Select a group'}
//           showActiveCount={selectedTeam && selectedTeam.id !== 'all'}
//           activeCount={selectedTeam?.members?.length || 0}
//         />

//         <MessageList messages={messages} showSeenIndicators />

//         <MessageComposer
//           onSendMessage={handleSendMessage}
//           disabled={!selectedTeam || selectedTeam.id === 'all'}
//           placeholder={
//             selectedTeam?.id === 'all'
//               ? 'Select a specific group to send broadcasts'
//               : 'Type your broadcast message...'
//           }
//         />
//       </div>

//       <TeamCreationModal
//         isOpen={showTeamModal}
//         onClose={() => setShowTeamModal(false)}
//         onTeamCreated={handleTeamCreated}
//       />
//     </div>
//   );
// };

// export default AdminBroadCast;


import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../shared/hooks/useAuth';
import ChatList from '../../shared/components/broadcast-shared/ChatList';
import ChatHeader from '../../shared/components/broadcast-shared/ChatHeader';
import MessageList from '../../shared/components/broadcast-shared/MessageList';
import MessageComposer from '../../shared/components/broadcast-shared/MessageComposer';
import TeamCreationModal from '../../shared/components/broadcast-shared/TeamCreationModal';
import api from '../../shared/services/apiService';
import socketService from '../../shared/services/socketService';

const AdminBroadCast = () => {
  const { user } = useAuth();
  const isAdmin = (user?.role || '').toLowerCase() === 'admin';
  const [selectedTeam, setSelectedTeam] = useState(null);
  const selectedTeamRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [groups, setGroups] = useState([]);
  const [broadcasts, setBroadcasts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [currentGroupId, setCurrentGroupId] = useState(null);
  const sentMessagesRef = useRef(new Set()); // Track recently sent messages

  // keep the latest team in a ref (used by socket callbacks)
  useEffect(() => {
    selectedTeamRef.current = selectedTeam;
  }, [selectedTeam]);

  // 🔌 Initialize socket
  useEffect(() => {
    console.log('🔌 Initializing socket...');
    const socket = socketService.connect();

    if (socket) console.log('✅ Socket connected:', socket.id);
    else console.error('❌ Socket failed to connect');

    const connectionCheck = setInterval(() => {
      if (socketService.socket) {
        console.log('🔍 Socket status:', {
          connected: socketService.isConnected,
          id: socketService.socket.id,
        });
      }
    }, 10000);

    return () => {
      clearInterval(connectionCheck);
      if (currentGroupId) socketService.leaveGroup(currentGroupId);
    };
  }, [currentGroupId]);

  // 📡 Fetch available groups
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/groups');
        const groupsData = response.data?.groups || [];

        const fmtTime = (d) => {
          if (!d) return '';
          try {
            const dt = new Date(d);
            const now = new Date();
            const isSameDay = dt.getFullYear() === now.getFullYear() && dt.getMonth() === now.getMonth() && dt.getDate() === now.getDate();
            if (isSameDay) {
              return dt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
            }
            const opts = { month: 'short', day: 'numeric' };
            if (dt.getFullYear() !== now.getFullYear()) opts['year'] = 'numeric';
            return dt.toLocaleDateString('en-US', opts);
          } catch {
            return '';
          }
        };

        const allGroups = [
          { id: 'all', name: 'All Groups', members: [], lastMessage: '', time: '' },
          ...groupsData.map(g => ({
            ...g,
            id: g._id,
            name: g.name,
            members: g.members || [],
            lastMessage: g.latestBroadcast?.message ?? g.lastMessage ?? '',
            time: fmtTime(g.latestBroadcast?.createdAt ?? g.time),
          })),
        ];

        setGroups(allGroups);

        // select the first real group automatically
        if (!selectedTeam && allGroups.length > 1) {
          setSelectedTeam(allGroups[1]);
        } else if (!selectedTeam) {
          setSelectedTeam(allGroups[0]);
        }
      } catch (err) {
        console.error('❌ Error fetching groups:', err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 🧠 Join group and fetch messages
  useEffect(() => {
    const joinAndFetchGroup = async (groupId) => {
      if (!groupId || groupId === 'all') {
        console.log('👥 Skipping join for "All Groups"');
        setBroadcasts([]);
        return;
      }

      if (currentGroupId && currentGroupId !== groupId) {
        socketService.leaveGroup(currentGroupId);
      }

      console.log('📦 Joining group:', groupId);
      socketService.joinGroup(groupId);
      setCurrentGroupId(groupId);

      try {
        const res = await api.get(`/broadcasts/${groupId}`);
        const broadcastsData = res.data?.broadcasts || [];

        // ✅ Sort oldest → newest so latest is always bottom
        const formatted = broadcastsData
          .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
          .map((msg) => ({
            id: msg._id,
            text: msg.message,
            sender: msg.createdBy?.name || 'Admin',
            time: new Date(msg.createdAt).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            }),
            isOwn: true,
          }));

        setBroadcasts(formatted);

        // ✅ Update lastMessage/time for this group in the sidebar
        const last = formatted[formatted.length - 1];
        if (last) {
          setGroups(prev => prev.map(g => {
            const gid = g._id || g.id;
            if (gid === groupId) {
              return {
                ...g,
                lastMessage: last.text?.slice(0, 80) || '',
                time: last.time || '',
              };
            }
            return g;
          }));
        }
      } catch (err) {
        console.error('❌ Error loading messages:', err);
        setBroadcasts([]);
      }
    };

    if (selectedTeam) {
      const groupId = selectedTeam._id || selectedTeam.id;
      joinAndFetchGroup(groupId);
    }
  }, [selectedTeam, currentGroupId]);

  // 🎧 Socket listeners
  useEffect(() => {
    // Get current user ID from localStorage with multiple fallbacks
    const getCurrentUserId = () => {
      try {
        // Try userInfo first (most common)
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
        if (userInfo._id || userInfo.id || userInfo.userId) {
          return userInfo._id || userInfo.id || userInfo.userId;
        }
        
        // Fallback to direct userId
        const directUserId = localStorage.getItem('userId');
        if (directUserId) {
          return directUserId;
        }
        
        return null;
      } catch (error) {
        console.warn('Error getting current user ID:', error);
        return null;
      }
    };

    const handleBroadcastReceived = (data) => {
      console.log('📨 Broadcast received:', data);
      
      // ✅ FIRST CHECK: If we just sent this message, ignore it
      if (sentMessagesRef.current.has(data.message)) {
        console.log('🚫 Ignoring own message (tracked in sentMessages):', data.message);
        return;
      }
      
      // ✅ SECOND CHECK: Compare user IDs as backup
      const currentUserId = getCurrentUserId();
      const senderId = data?.createdBy?._id || data?.createdBy?.id || data?.senderId || data?.userId;
      
      console.log('🔍 User ID comparison:', {
        currentUserId,
        senderId,
        senderData: data?.createdBy,
        messageText: data?.message
      });

      // ✅ Prevent admin from receiving their own message again
      if (currentUserId && senderId && String(currentUserId) === String(senderId)) {
        console.log('� Ignoring own message from broadcast_received');
        return;
      }

      // Only add messages from other users
      console.log('✅ Adding message from another user:', data.message);
      const newMsg = {
        id: data._id || Date.now(),
        text: data.message,
        sender: data.createdBy?.name || 'Admin',
        time: new Date(data.createdAt || Date.now()).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        isOwn: false,
      };

      setBroadcasts((prev) => [...prev, newMsg]);

      // ✅ Update lastMessage/time for the relevant group in the sidebar
      const groupId = data.groupId || data.group;
      if (groupId) {
        setGroups(prev => prev.map(g => {
          const gid = g._id || g.id;
          if (gid === groupId) {
            return {
              ...g,
              lastMessage: (data.message || '').slice(0, 80),
              time: new Date(data.createdAt || Date.now()).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            };
          }
          return g;
        }));
      }
    };

    const handleBroadcastSent = (data) => {
      console.log('✅ Broadcast sent confirmation:', data);

      if (data.success && data.broadcast) {
        const msg = data.broadcast;

        const confirmedMsg = {
          id: msg._id,
          text: msg.message,
          sender: 'You',
          time: new Date(msg.createdAt).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          isOwn: true,
        };

        // Replace optimistic message with confirmed one
        setBroadcasts((prev) => {
          // Find and replace the optimistic message
          const updated = prev.map((existingMsg) => {
            if (existingMsg.isOptimistic && existingMsg.text === msg.message) {
              return confirmedMsg;
            }
            return existingMsg;
          });

          // If no optimistic message found, just add the confirmed one
          const hasOptimistic = prev.some(m => m.isOptimistic && m.text === msg.message);
          if (!hasOptimistic) {
            return [...prev, confirmedMsg];
          }

          return updated;
        });

        // ✅ Update lastMessage/time in groups for this group
        const groupId = msg.groupId || msg.group;
        if (groupId) {
          setGroups(prev => prev.map(g => {
            const gid = g._id || g.id;
            if (gid === groupId) {
              return {
                ...g,
                lastMessage: (msg.message || '').slice(0, 80),
                time: new Date(msg.createdAt || Date.now()).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
              };
            }
            return g;
          }));
        }
      }
    };

  socketService.onBroadcastReceived(handleBroadcastReceived);
  socketService.getSocket()?.on('broadcast_sent', handleBroadcastSent);

  return () => {
    socketService.offBroadcastReceived(handleBroadcastReceived);
    socketService.getSocket()?.off('broadcast_sent', handleBroadcastSent);
  };
}, []);


  // ✉️ Send new message
  const handleSendMessage = (messageText) => {
    const trimmed = messageText.trim();
    const groupId = selectedTeam ? (selectedTeam._id || selectedTeam.id) : null;

    if (!groupId || groupId === 'all' || !trimmed) {
      console.warn('⚠️ Cannot send message:', { groupId, messageText: trimmed });
      return;
    }

    // Track this message to ignore it when it comes back via broadcast_received
    sentMessagesRef.current.add(trimmed);
    console.log('📝 Tracked sent message:', trimmed);
    
    // Clean up after 10 seconds
    setTimeout(() => {
      sentMessagesRef.current.delete(trimmed);
      console.log('🧹 Cleaned up tracked message:', trimmed);
    }, 10000);

    // ✅ Show message immediately (optimistic update)
    const optimisticMessage = {
      id: 'temp_' + Date.now(),
      text: trimmed,
      sender: 'You',
      time: new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      isOwn: true,
      isOptimistic: true, // Mark as optimistic for replacement later
    };

    // Add message to UI immediately
    setBroadcasts((prev) => [...prev, optimisticMessage]);

    console.log('📤 Sending broadcast:', { groupId, message: trimmed });
    socketService.sendBroadcast(groupId, trimmed);
  };

  // 🔍 Misc handlers
  const handleTeamSelect = (team) => {
    console.log('📌 Selected team:', team);
    setSelectedTeam(team);
  };

  const handleAddTeam = () => setShowTeamModal(true);
  const handleTeamCreated = (newTeam) => {
    const formatted = { ...newTeam, id: newTeam._id, _id: newTeam._id };
    setGroups((prev) => [...prev, formatted]);
    setSelectedTeam(formatted);
  };

  // 🖥️ Render
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
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

  // Filter groups by searchQuery for the sidebar search box
  const filteredGroups = groups.filter(g => (g.name || '').toLowerCase().includes((searchQuery || '').toLowerCase()));

  return (
    <div className="flex gap-4 h-full max-h-full overflow-hidden items-start">
      {/* Sidebar */}
      <div className="hidden md:block h-[80vh]">
        <ChatList
          teams={filteredGroups}
          selectedTeam={selectedTeam}
          onTeamSelect={handleTeamSelect}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          showAddButton
          selectedStyle="bg-[var(--blue100)]"
          onAddTeam={handleAddTeam}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 min-w-0 bg-white rounded-lg flex flex-col h-[80vh] overflow-hidden">
        <ChatHeader
          teamName={selectedTeam?.name || 'Select a group'}
          showActiveCount={false}
          activeCount={selectedTeam?.members?.length || 0}
          onInfoClick={() => setShowInfo(true)}
        />

        <MessageList messages={broadcasts} showSeenIndicators />

        {isAdmin && (
          <MessageComposer
            onSendMessage={handleSendMessage}
            disabled={!selectedTeam || selectedTeam.id === 'all'}
            placeholder={
              selectedTeam?.id === 'all'
                ? 'Select a specific group to send broadcasts'
                : 'Type your broadcast message...'
            }
          />
        )}
      </div>

      <TeamCreationModal
        isOpen={showTeamModal}
        onClose={() => setShowTeamModal(false)}
        onTeamCreated={handleTeamCreated}
      />
      {/* Group members info modal (admin) */}
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

export default AdminBroadCast;

