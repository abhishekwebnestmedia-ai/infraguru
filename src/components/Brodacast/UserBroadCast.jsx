import React, { useState } from 'react';
import ChatList from './shared/ChatList';
import ChatHeader from './shared/ChatHeader';
import MessageList from './shared/MessageList';

const UserBroadCast = () => {
  const [selectedTeam, setSelectedTeam] = useState('Team 1');
  const [searchQuery, setSearchQuery] = useState('');

  //existing data...
  const teams = [
    { id: 'all', name: 'All', lastMessage: 'Planning a weekend getaway. Any suggestions? Plannin...', time: '05:25 PM' },
    { id: 'team1', name: 'Team 1', lastMessage: 'Planning a weekend getaway. Any suggestions? Plannin...', time: '05:25 PM' },
    { id: 'team2', name: 'Team 2', lastMessage: 'Planning a weekend getaway. Any suggestions? Plannin...', time: '05:25 PM' },
    { id: 'team3', name: 'Team 3', lastMessage: 'Planning a weekend getaway. Any suggestions? Plannin...', time: '05:25 PM' },
    { id: 'team4', name: 'Team 4', lastMessage: 'Planning a weekend getaway. Any suggestions? Plannin...', time: '05:25 PM' },
    { id: 'team5', name: 'Team 5', lastMessage: 'Planning a weekend getaway. Any suggestions? Plannin...', time: '05:25 PM' },
  ];

  const messages = [
    {
      id: 1,
      text: "Planning a weekend getaway. Any suggestions? Planning a weekend getaway. Any suggestions?",
      time: "05:25 PM",
      isOwn: false
    }
  ];

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex gap-4 p-4 h-full max-h-full overflow-hidden items-start">
      <ChatList
        teams={filteredTeams}
        selectedTeam={selectedTeam}
        onTeamSelect={setSelectedTeam}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="flex-1 min-w-0 bg-white rounded-lg flex flex-col h-11/12 overflow-hidden">
        <ChatHeader
          teamName={selectedTeam}
          showActiveCount={true}
          activeCount={4}
        />

        <MessageList messages={messages} />
      </div>
    </div>
  );
};

export default UserBroadCast;
