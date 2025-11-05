import React, { useState, useEffect } from 'react';
import { X, User, CheckSquare, Square, Eye, Trash2 } from 'lucide-react';
import api from '../services/apiService';
import { toast } from 'react-toastify';

const BulkAssignModal = ({ isOpen, onClose, onSuccess }) => {
  const [users, setUsers] = useState([]);
  const [unassignedLeads, setUnassignedLeads] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedLeads, setSelectedLeads] = useState(new Set());
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchData();
    } else {
      // Reset state when modal closes
      setSelectedUser(null);
      setSelectedLeads(new Set());
      setShowPreview(false);
    }
  }, [isOpen]);

  const fetchData = async () => {
    try {
      setFetchingData(true);
      
      // Fetch active users
      const usersResponse = await api.get('/auth/activeuser');
      if (usersResponse.data.success) {
        setUsers(usersResponse.data.users);
      }

      // Fetch all leads and filter unassigned
      const allLeadsResponse = await api.get('/lead/getlead');
      const allLeads = allLeadsResponse.data?.leads || allLeadsResponse.data?.data || [];
      const unassigned = allLeads.filter(lead => !lead.assignedTo);
      setUnassignedLeads(unassigned);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setFetchingData(false);
    }
  };

  const handleLeadToggle = (leadId) => {
    const newSelected = new Set(selectedLeads);
    if (newSelected.has(leadId)) {
      newSelected.delete(leadId);
    } else {
      newSelected.add(leadId);
    }
    setSelectedLeads(newSelected);
  };

  const handleSelectAllLeads = () => {
    if (selectedLeads.size === unassignedLeads.length) {
      setSelectedLeads(new Set());
    } else {
      setSelectedLeads(new Set(unassignedLeads.map(lead => lead._id)));
    }
  };

  const handleRemoveFromPreview = (leadId) => {
    const newSelected = new Set(selectedLeads);
    newSelected.delete(leadId);
    setSelectedLeads(newSelected);
  };

  const handlePreview = () => {
    if (!selectedUser) {
      toast.warning('Please select a user');
      return;
    }
    if (selectedLeads.size === 0) {
      toast.warning('Please select at least one lead');
      return;
    }
    setShowPreview(true);
  };

  const handleAssign = async () => {
    if (!selectedUser || selectedLeads.size === 0) return;

    try {
      setLoading(true);
      const response = await api.post('/lead/bulk-assign', {
        leadIds: Array.from(selectedLeads),
        assignedTo: selectedUser.name
      });

      if (response.data.success) {
        toast.success(response.data.message || 'Leads assigned successfully');
        onSuccess?.();
        onClose();
      }
    } catch (error) {
      console.error('Error assigning leads:', error);
      toast.error(error.response?.data?.message || 'Failed to assign leads');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const getSelectedLeadsData = () => {
    return unassignedLeads.filter(lead => selectedLeads.has(lead._id));
  };

  return (
    <div className="fixed inset-0 bg-white bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            {showPreview ? 'Preview Assignment' : 'Bulk Assign Leads'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {fetchingData ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading data...</p>
              </div>
            </div>
          ) : showPreview ? (
            // Preview Mode
            <div className="space-y-6">
              {/* Selected User Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Assigning To:</h3>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {selectedUser.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{selectedUser.name}</p>
                    <p className="text-sm text-gray-600">{selectedUser.email}</p>
                  </div>
                </div>
              </div>

              {/* Selected Leads */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Selected Leads ({selectedLeads.size})
                  </h3>
                  <button
                    onClick={() => setShowPreview(false)}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    ← Back to Selection
                  </button>
                </div>
                <div className="space-y-2">
                  {getSelectedLeadsData().map((lead) => (
                    <div
                      key={lead._id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{lead.name || lead.clientName || 'Unnamed Lead'}</p>
                        <p className="text-sm text-gray-600">{lead.email || lead.phone || 'No contact info'}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveFromPreview(lead._id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove from selection"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // Selection Mode
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Users Selection */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Select User</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {users.map((user) => (
                    <div
                      key={user._id}
                      onClick={() => setSelectedUser(user)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedUser?._id === user._id
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            selectedUser?._id === user._id ? 'bg-blue-600' : 'bg-gray-400'
                          }`}
                        >
                          <span className="text-white font-semibold">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">{user.name}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                        {user.isLoggedIn && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                            Active
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  {users.length === 0 && (
                    <p className="text-center text-gray-500 py-8">No users available</p>
                  )}
                </div>
              </div>

              {/* Leads Selection */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Unassigned Leads ({unassignedLeads.length})
                  </h3>
                  {unassignedLeads.length > 0 && (
                    <button
                      onClick={handleSelectAllLeads}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                    >
                      {selectedLeads.size === unassignedLeads.length ? (
                        <>
                          <CheckSquare size={16} />
                          Deselect All
                        </>
                      ) : (
                        <>
                          <Square size={16} />
                          Select All
                        </>
                      )}
                    </button>
                  )}
                </div>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {unassignedLeads.map((lead) => (
                    <div
                      key={lead._id}
                      onClick={() => handleLeadToggle(lead._id)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedLeads.has(lead._id)
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`flex-shrink-0 ${selectedLeads.has(lead._id) ? 'text-blue-600' : 'text-gray-400'}`}>
                          {selectedLeads.has(lead._id) ? (
                            <CheckSquare size={20} />
                          ) : (
                            <Square size={20} />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-800 truncate">
                            {lead.name || lead.clientName || 'Unnamed Lead'}
                          </p>
                          <p className="text-sm text-gray-600 truncate">
                            {lead.email || lead.phone || 'No contact info'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {unassignedLeads.length === 0 && (
                    <p className="text-center text-gray-500 py-8">No unassigned leads available</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {selectedLeads.size > 0 && (
                <span className="font-medium">
                  {selectedLeads.size} lead{selectedLeads.size !== 1 ? 's' : ''} selected
                  {selectedUser && ` for ${selectedUser.name}`}
                </span>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
              >
                Cancel
              </button>
              {showPreview ? (
                <button
                  onClick={handleAssign}
                  disabled={loading || selectedLeads.size === 0}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Assigning...
                    </>
                  ) : (
                    <>Assign Leads to {selectedUser?.name}</>
                  )}
                </button>
              ) : (
                <button
                  onClick={handlePreview}
                  disabled={!selectedUser || selectedLeads.size === 0}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Eye size={18} />
                  Preview
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkAssignModal;
