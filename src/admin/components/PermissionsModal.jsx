import React, { useState, useEffect } from 'react';
import { X, Shield } from 'lucide-react';
import api from '../../shared/services/apiService';
import { toast } from 'react-toastify';

const PermissionsModal = ({ isOpen, onClose, profile, onSuccess }) => {
  const [permissionsState, setPermissionsState] = useState({});
  const [saving, setSaving] = useState(false);

  // Initialize permissions state when modal opens
  useEffect(() => {
    if (isOpen && profile?.permissions) {
      const permissions = profile.permissions;
      if (permissions && typeof permissions === 'object' && !Array.isArray(permissions)) {
        setPermissionsState({ ...permissions });
      } else {
        setPermissionsState({});
      }
    }
  }, [isOpen, profile]);

  const handleToggle = (key) => {
    setPermissionsState(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload = {
        userId: profile._id || profile.id,
        permissions: permissionsState
      };
      
      const response = await api.put('/auth/permissions', payload);
      
      if (response.data?.success) {
        toast.success('Permissions updated successfully');
        if (onSuccess) {
          await onSuccess();
        }
        onClose();
      } else {
        toast.error(response.data?.message || 'Failed to update permissions');
      }
    } catch (err) {
      console.error('Error updating permissions:', err);
      toast.error(err.response?.data?.message || 'Failed to update permissions');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset to original permissions
    if (profile?.permissions) {
      setPermissionsState({ ...profile.permissions });
    }
    onClose();
  };

  if (!isOpen) return null;

  const permissionEntries = Object.entries(permissionsState);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-800">
              Edit Permissions
            </h2>
          </div>
          <button
            onClick={handleCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {permissionEntries.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No permissions available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {permissionEntries.map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <button
                    onClick={() => handleToggle(key)}
                    className="relative inline-flex items-center cursor-pointer"
                  >
                    <div
                      className={`w-12 h-6 rounded-full transition-colors ${
                        value ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    >
                      <div
                        className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full shadow-md transition-transform ${
                          value ? 'transform translate-x-6' : ''
                        }`}
                      ></div>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleCancel}
            disabled={saving}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PermissionsModal;
