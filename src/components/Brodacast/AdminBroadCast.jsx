import React, { useState } from 'react';
import ChatList from './shared/ChatList';
import ChatHeader from './shared/ChatHeader';
import MessageList from './shared/MessageList';
import MessageComposer from './shared/MessageComposer';

const AdminBroadCast = () => {
  const [selectedTeam, setSelectedTeam] = useState('Team 1');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileChatList, setShowMobileChatList] = useState(false); // Changed name for clarity

  // Convert messages to state so it can be updated
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Planning a weekend getaway. Any suggestions? Planning a weekend getaway.",
      time: "05:25 PM",
      isOwn: true,
      seen: true,
      seenCount: 4
    }
  ]);

  // Mock data for teams
  const teams = [
    { id: 'all', name: 'All', lastMessage: 'Planning a weekend getaway. Any suggestions? Plannin...', time: '05:25 PM' },
    { id: 'team1', name: 'Team 1', lastMessage: 'Planning a weekend getaway. Any suggestions? Plannin...', time: '05:25 PM' },
    { id: 'team2', name: 'Team 2', lastMessage: 'Planning a weekend getaway. Any suggestions? Plannin...', time: '05:25 PM' },
    { id: 'team3', name: 'Team 3', lastMessage: 'Planning a weekend getaway. Any suggestions? Plannin...', time: '05:25 PM' },
    { id: 'team4', name: 'Team 4', lastMessage: 'Planning a weekend getaway. Any suggestions? Plannin...', time: '05:25 PM' },
    { id: 'team5', name: 'Team 5', lastMessage: 'Planning a weekend getaway. Any suggestions? Plannin...', time: '05:25 PM' },
    { id: 'team6', name: 'Team 6', lastMessage: 'Planning a weekend getaway. Any suggestions? Plannin...', time: '05:25 PM' },
  ];

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to handle sending new messages
  const handleSendMessage = (messageText) => {
    const newMessage = {
      id: messages.length + 1,
      text: messageText,
      time: new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }),
      isOwn: true,
      seen: false,
      seenCount: 0
    };

    setMessages(prevMessages => [...prevMessages, newMessage]);
  };

  const handleTeamSelect = (team) => {
    setSelectedTeam(team);
    setShowMobileChatList(false); // Close chat list on mobile after selection
  };

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
            />
          </div>
        ) : (
          /* Mobile Chat Interface */
          <div className="flex-1 min-w-0 bg-white rounded-lg flex flex-col h-full overflow-hidden">
            <ChatHeader
              teamName={selectedTeam}
              showActiveCount={selectedTeam !== 'All'}
              activeCount={4}
              onMenuClick={() => setShowMobileChatList(true)}
              showBackButton={true} // ✅ Always show when in chat view
            />

            <MessageList messages={messages} showSeenIndicators={true} />
            <MessageComposer onSendMessage={handleSendMessage} disabled={false} />
          </div>
        )}
      </div>


      {/* Desktop: Chat Interface */}
      <div className="hidden md:flex flex-1 min-w-0 bg-white rounded-lg flex-col h-11/12 overflow-hidden">
        <ChatHeader
          teamName={selectedTeam}
          showActiveCount={selectedTeam !== 'All'}
          activeCount={4}
          
        />

        <MessageList
          messages={messages}
          showSeenIndicators={true}
        />

        <MessageComposer
          onSendMessage={handleSendMessage}
          disabled={false}
        />
      </div>
    </div>
  );
};

export default AdminBroadCast;
