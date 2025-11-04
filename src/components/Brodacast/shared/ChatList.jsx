import React from 'react';
import { Search, Plus, X, ArrowLeft } from 'lucide-react';

const ChatList = ({ 
  teams, 
  selectedTeam, 
  onTeamSelect, 
  searchQuery, 
  onSearchChange,
  showAddButton = false,
  selectedStyle = 'bg-blue-50',
  onClose,
  isMobile = false,
  onAddTeam
}) => {
  return (
    <div className={`bg-white rounded-lg flex flex-col overflow-hidden ${
      isMobile ? 'h-full' : 'w-72 sm:w-96 h-full  max-h-screen '
    }`}>
      
      {/* Mobile Header */}
      {isMobile && (
        <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            {/* <ArrowLeft size={20} className="text-gray-600" /> */}
          </button>
          <h2 className="text-xl font-semibold text-gray-900">Chats</h2>
          <div className="w-10 h-10"></div> {/* Spacer for centering */}
        </div>
      )}

      {/* Desktop Close Button */}
      {!isMobile && (
        <div className="md:hidden flex justify-end p-2">
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>
      )}

      {/* Search Section with optional Plus Button */}
      <div className="p-4 flex-shrink-0">
        <div className={showAddButton ? "flex gap-2" : "relative"}>
          {showAddButton ? (
            <>
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search chats..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-gray-50"
                />
              </div>
              <button 
                className="p-3 bg-[var(--blue700)] text-white rounded-xl hover:bg-blue-800 transition-colors"
                onClick={onAddTeam}
              >
                <Plus size={20} />
              </button>
            </>
          ) : (
            <>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search chats..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-gray-50"
              />
            </>
          )}
        </div>
      </div>

      {/* Teams List - Enhanced scrolling for mobile */}
      <div className={`flex-1 min-h-0 ${isMobile ? 'overflow-y-auto scrollbar-hide' : 'overflow-y-auto'} scrollbar-hide`}>
        {teams.map((team) => (
          <div
            key={team.id}
            onClick={() => onTeamSelect(team.name)}
            className={`p-4 cursor-pointer hover:bg-gray-50 border-b border-gray-100 transition-colors ${
              selectedTeam === team.name ? selectedStyle : ''
            }`}
          >
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-semibold text-sm">
                  {team.name.charAt(0)}
                </span>
              </div>
              
              {/* Chat Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-gray-900 text-sm truncate">
                    {team.name}
                  </h3>
                  <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                    {team.time}
                  </span>
                </div>
                <p className="text-sm text-gray-600 truncate">
                  {team.lastMessage}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatList;
