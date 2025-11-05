import React, { useState, useEffect } from 'react';
import { X, User, Check } from 'lucide-react';
import api from '../../services/apiService';

const TeamCreationModal = ({ isOpen, onClose, onTeamCreated }) => {
  const [teamName, setTeamName] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get('/auth/teams');
      
      // Debug: Log the response structure
      console.log('Auth/teams API response:', response.data);
      
      setUsers(response.data?.users || response.data?.data || []);
    } catch (err) {
      setError('Failed to load users');
      console.error('Error fetching users:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserToggle = (user) => {
    setSelectedUsers(prev => {
      const isSelected = prev.some(u => u._id === user._id);
      if (isSelected) {
        return prev.filter(u => u._id !== user._id);
      } else {
        return [...prev, user];
      }
    });
  };

  const handleCreateTeam = async () => {
    if (!teamName.trim() || selectedUsers.length === 0) return;

    try {
      setIsCreating(true);
      const response = await api.post('/groups', {
        name: teamName.trim(),
        members: selectedUsers.map(user => user.name) // Use names as shown in your example
      });
      
      onTeamCreated(response.data);
      onClose();
      resetForm();
    } catch (err) {
      setError('Failed to create team');
      console.error('Error creating team:', err);
    } finally {
      setIsCreating(false);
    }
  };

  const resetForm = () => {
    setTeamName('');
    setSelectedUsers([]);
    setSearchQuery('');
    setError(null);
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Create New Team</h2>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Team Name Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Team Name *
            </label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter team name"
              maxLength={50}
            />
          </div>

          {/* User Search */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search & Select Team Members *
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search users by name, username, or email"
            />
          </div>

          {/* Selected Users Count */}
          {selectedUsers.length > 0 && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                {selectedUsers.length} user{selectedUsers.length > 1 ? 's' : ''} selected
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Users List */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Available Users ({filteredUsers.length})
            </h3>
            
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p className="text-gray-600">Loading users...</p>
                </div>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No users found
              </div>
            ) : (
              <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
                {filteredUsers.map((user) => {
                  const isSelected = selectedUsers.some(u => u._id === user._id);
                  return (
                    <div
                      key={user._id}
                      onClick={() => handleUserToggle(user)}
                      className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${
                        isSelected ? 'bg-blue-50' : ''
                      }`}
                    >
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                        <User size={20} className="text-gray-600" />
                      </div>
                      
                      {/* User Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user.email} {user.username && `• @${user.username}`}
                        </p>
                        {user.designation && (
                          <p className="text-xs text-gray-400 truncate">
                            {user.designation}
                          </p>
                        )}
                      </div>
                      
                      {/* Selection Indicator */}
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        isSelected 
                          ? 'bg-blue-600 border-blue-600' 
                          : 'border-gray-300'
                      }`}>
                        {isSelected && <Check size={14} className="text-white" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            disabled={isCreating}
          >
            Cancel
          </button>
          <button
            onClick={handleCreateTeam}
            disabled={!teamName.trim() || selectedUsers.length === 0 || isCreating}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isCreating && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            )}
            Create Team
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamCreationModal;