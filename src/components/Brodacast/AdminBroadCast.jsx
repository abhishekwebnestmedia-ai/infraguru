import React, { useState } from 'react';
import ChatList from './shared/ChatList';
import ChatHeader from './shared/ChatHeader';
import MessageList from './shared/MessageList';
import MessageComposer from './shared/MessageComposer';

const AdminBroadCast = () => {
  const [selectedTeam, setSelectedTeam] = useState('Team 1');
  const [searchQuery, setSearchQuery] = useState('');
  
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
  ];

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to handle sending new messages
  const handleSendMessage = (messageText) => {
    const newMessage = {
      id: messages.length + 1, // Simple ID generation
      text: messageText,
      time: new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }),
      isOwn: true, // Admin's message
      seen: false, // New message hasn't been seen yet
      seenCount: 0
    };

    // Add new message to the end of messages array
    setMessages(prevMessages => [...prevMessages, newMessage]);
  };

  return (
    <div className="flex gap-4 p-4 h-full max-h-full overflow-hidden items-start">
      <ChatList 
        teams={filteredTeams}
        selectedTeam={selectedTeam}
        onTeamSelect={setSelectedTeam}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        showAddButton={true}
        selectedStyle="bg-[var(--blue100)]"
      />
      
      <div className="flex-1 min-w-0 bg-white rounded-lg flex flex-col h-11/12 overflow-hidden">
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
