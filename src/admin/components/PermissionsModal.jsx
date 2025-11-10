import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Shield } from 'lucide-react';
import api from '../../shared/services/apiService';
import { toast } from 'react-toastify';
import { FEATURE_PERMISSIONS } from '../../shared/utils/permissions';

// Backend keys we support (ensure these are always shown), derived from central mapping
const DEFAULT_PERMISSION_KEYS = Array.from(new Set(Object.values(FEATURE_PERMISSIONS)));

const PermissionsModal = ({ isOpen, onClose, profile, onSuccess, readOnly = false, title }) => {
  const [permissionsState, setPermissionsState] = useState({});
  const [saving, setSaving] = useState(false);

  // Initialize permissions state when modal opens
  useEffect(() => {
    if (isOpen && profile?.permissions) {
      const permissions = profile.permissions;
      let base = {};
      if (permissions && typeof permissions === 'object' && !Array.isArray(permissions)) {
        base = { ...permissions };
      }
      // Ensure all default keys are present
      const merged = DEFAULT_PERMISSION_KEYS.reduce((acc, key) => {
        acc[key] = Boolean(base[key]);
        return acc;
      }, {});
      setPermissionsState(merged);
    } else if (isOpen && profile && !profile.permissions) {
      // No permissions provided - start with all defaults set to false
      const init = DEFAULT_PERMISSION_KEYS.reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {});
      setPermissionsState(init);
    }
  }, [isOpen, profile]);

  const handleToggle = (key) => {
    if (readOnly) return;
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
    // On close, don't persist changes. Reset state next open.
    onClose();
  };

  if (!isOpen) return null;

  const permissionEntries = Object.entries(permissionsState);

  const modal = (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-3"
      style={{
        background: 'linear-gradient(135deg, rgba(0,42,128,0.60) 0%, rgba(0,42,128,0.35) 40%, rgba(0,0,0,0.55) 100%)',
        backdropFilter: 'blur(6px)'
      }}>
      <div className="bg-white/95 rounded-xl shadow-2xl w-full max-w-md max-h-[85vh] overflow-hidden flex flex-col border border-white/40">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-blue-600" />
            <h2 className="text-lg font-bold text-gray-800">
              {title || (readOnly ? 'Permissions' : 'Edit Permissions')}
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
        <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
          {permissionEntries.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No permissions available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {permissionEntries.map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <button
                    onClick={() => handleToggle(key)}
                    className={`relative inline-flex items-center ${readOnly ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                    disabled={readOnly}
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
        <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200 bg-gray-50/80">
          <button
            onClick={handleCancel}
            disabled={saving}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            Close
          </button>
          {!readOnly && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
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
          )}
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modal, document.body) : modal;
};

export default PermissionsModal;
