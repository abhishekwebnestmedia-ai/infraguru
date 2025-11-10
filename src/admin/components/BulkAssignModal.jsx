import React, { useState, useEffect } from 'react';
import { X, User, CheckSquare, Square, Eye, Trash2 } from 'lucide-react';
import api from '../../shared/services/apiService';
import { toast } from 'react-toastify';

const BulkAssignModal = ({ isOpen, onClose, onSuccess }) => {
  const [users, setUsers] = useState([]);
  const [userQuery, setUserQuery] = useState('');
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

  const filteredUsers = users.filter(u => {
    if (!userQuery) return true;
    const q = userQuery.toLowerCase();
    return (u.name || '').toLowerCase().includes(q) || (u.email || '').toLowerCase().includes(q);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: 'linear-gradient(135deg, rgba(0,42,128,0.60) 0%, rgba(0,42,128,0.35) 40%, rgba(0,0,0,0.55) 100%)',
        backdropFilter: 'blur(6px)'
      }}
    >
      <div className="bg-white/95 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col border border-white/40">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            {showPreview ? 'Preview Assignment' : 'Bulk Assign Leads'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            type="button"
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

              {/* Selected Leads (table view in preview) */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Selected Leads ({selectedLeads.size})</h3>
                  <button
                    onClick={() => setShowPreview(false)}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    type="button"
                  >
                    ← Back to Selection
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm table-auto">
                    <thead>
                      <tr className="text-left text-xs text-gray-500">
                        <th className="px-3 py-2 w-8">ID</th>
                        <th className="px-3 py-2">Name</th>
                        <th className="px-3 py-2">Contact</th>
                        <th className="px-3 py-2">Source</th>
                        <th className="px-3 py-2">Created</th>
                        <th className="px-3 py-2 w-20">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getSelectedLeadsData().map((lead) => (
                        <tr key={lead._id} className="border-t border-gray-100 hover:bg-gray-50">
                          <td className="px-3 py-2 align-top text-gray-700">{String(lead._id).slice(0, 6)}</td>
                          <td className="px-3 py-2 align-top text-gray-700">{lead.name || lead.clientName || 'Unnamed'}</td>
                          <td className="px-3 py-2 align-top text-gray-600">{lead.email || lead.phone || '-'}</td>
                          <td className="px-3 py-2 align-top text-gray-600">{lead.source || lead.origination || '-'}</td>
                          <td className="px-3 py-2 align-top text-gray-600">{lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : '-'}</td>
                          <td className="px-3 py-2 align-top">
                            <button
                              onClick={() => handleRemoveFromPreview(lead._id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="Remove from selection"
                              type="button"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {selectedLeads.size === 0 && (
                        <tr>
                          <td colSpan={6} className="px-3 py-6 text-center text-gray-500">No leads selected</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            ) : (
            // Selection Mode (search users on top, leads table below)
            <div className="flex flex-col gap-6">
              {/* Users Search + Selection */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Select User</h3>
                <div>
                  <div className="text-sm text-gray-500 mb-2">Type a name or email and press Enter to select a user</div>
                  <div className="mb-3 relative">
                    <input
                      type="text"
                      value={selectedUser ? selectedUser.name : userQuery}
                      onChange={(e) => setUserQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (filteredUsers && filteredUsers.length > 0) {
                            setSelectedUser(filteredUsers[0]);
                            setUserQuery('');
                          }
                        }
                      }}
                      placeholder="Search users by name or email"
                      readOnly={!!selectedUser}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />

                    {/* Clear button inside input when a user is selected */}
                    {selectedUser && (
                      <button
                        type="button"
                        onClick={() => { setSelectedUser(null); setUserQuery(''); }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-red-500"
                      >
                        Clear
                      </button>
                    )}

                    {/* Suggestion dropdown (typeahead). Absolute so it doesn't change container height */}
                    {!selectedUser && userQuery && filteredUsers.length > 0 && (
                      <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow max-h-56 overflow-auto">
                        {filteredUsers.slice(0, 8).map((u) => (
                          <button
                            key={u._id || u.id || u.email}
                            onClick={() => {
                              setSelectedUser(u);
                              setUserQuery('');
                            }}
                            className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-3"
                            type="button"
                          >
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">{(u.name || '').charAt(0).toUpperCase()}</div>
                            <div className="min-w-0">
                              <div className="text-sm font-medium text-gray-800 truncate">{u.name}</div>
                              <div className="text-xs text-gray-500 truncate">{u.email}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Leads Selection */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Unassigned Leads ({unassignedLeads.length})</h3>
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

                {/* Leads table (primary selection UI). No card-list below. */}
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm table-auto">
                    <thead>
                      <tr className="text-left text-xs text-gray-500">
                        <th className="px-3 py-2 w-8">
                          <input
                            type="checkbox"
                            checked={unassignedLeads.length > 0 && selectedLeads.size === unassignedLeads.length}
                            onChange={handleSelectAllLeads}
                          />
                        </th>
                        <th className="px-3 py-2">ID</th>
                        <th className="px-3 py-2">Name</th>
                        <th className="px-3 py-2">Contact</th>
                        <th className="px-3 py-2">Source</th>
                        <th className="px-3 py-2">Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {unassignedLeads.map((lead) => (
                        <tr
                          key={lead._id}
                          onClick={() => handleLeadToggle(lead._id)}
                          className={`border-t border-gray-100 hover:bg-gray-50 ${selectedLeads.has(lead._id) ? 'bg-blue-50' : ''}`}
                        >
                          <td className="px-3 py-2 align-top">
                            <input
                              type="checkbox"
                              checked={selectedLeads.has(lead._id)}
                              onChange={(e) => { e.stopPropagation(); handleLeadToggle(lead._id); }}
                            />
                          </td>
                          <td className="px-3 py-2 align-top text-gray-700">{String(lead._id).slice(0, 6)}</td>
                          <td className="px-3 py-2 align-top text-gray-700">{lead.name || lead.clientName || 'Unnamed'}</td>
                          <td className="px-3 py-2 align-top text-gray-600">{lead.email || lead.phone || '-'}</td>
                          <td className="px-3 py-2 align-top text-gray-600">{lead.source || lead.origination || '-'}</td>
                          <td className="px-3 py-2 align-top text-gray-600">{lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : '-'}</td>
                        </tr>
                      ))}
                      {unassignedLeads.length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-3 py-6 text-center text-gray-500">No unassigned leads available</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
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
