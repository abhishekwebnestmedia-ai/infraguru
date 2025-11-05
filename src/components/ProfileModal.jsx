import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, MapPin, IdCard, Briefcase, Shield, ChevronDown, ChevronUp } from 'lucide-react';
import api from '../services/apiService';
import { toast } from 'react-toastify';

const ProfileModal = ({ isOpen, onClose }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPermissions, setShowPermissions] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchProfile();
    }
  }, [isOpen]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/auth/profile');
      
      if (response.data.success) {
        setProfile(response.data.user);
      } else {
        setProfile(response.data);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err.response?.data?.message || 'Failed to load profile');
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  const getPermissionEntries = () => {
    if (!profile?.permissions || typeof profile.permissions !== 'object') {
      return [];
    }
    return Object.entries(profile.permissions);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Profile</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading profile...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <p className="text-red-500 mb-4">{error}</p>
                <button 
                  onClick={fetchProfile}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : profile ? (
            <div className="space-y-6">
              {/* Profile Header with Avatar */}
              <div className="flex items-center gap-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                  {profile.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-800">{profile.name || 'No Name'}</h3>
                  <p className="text-gray-600">{profile.email || 'No Email'}</p>
                  {profile.role && (
                    <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${
                      profile.role === 'admin' 
                        ? 'bg-red-100 text-red-700' 
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {profile.role}
                    </span>
                  )}
                </div>
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Mail className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-semibold text-gray-600">Email</span>
                  </div>
                  <p className="text-gray-800 ml-8">{profile.email || 'N/A'}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Phone className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-semibold text-gray-600">Phone Number</span>
                  </div>
                  <p className="text-gray-800 ml-8">{profile.phoneNumber || 'N/A'}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-semibold text-gray-600">Designation</span>
                  </div>
                  <p className="text-gray-800 ml-8">{profile.designation || 'N/A'}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <IdCard className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-semibold text-gray-600">Employee ID</span>
                  </div>
                  <p className="text-gray-800 ml-8">{profile.empid || 'N/A'}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg md:col-span-2">
                  <div className="flex items-center gap-3 mb-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-semibold text-gray-600">Address</span>
                  </div>
                  <p className="text-gray-800 ml-8">{profile.address || 'N/A'}</p>
                </div>
              </div>

              {/* Additional Information */}
              {(profile.firstLoginAt || profile.lastLogoutAt || profile.isLoggedIn !== undefined) && (
                <div className="border-t pt-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Activity</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profile.firstLoginAt && (
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <span className="text-sm font-semibold text-gray-600">First Login</span>
                        <p className="text-gray-800 mt-1">{formatDate(profile.firstLoginAt)}</p>
                      </div>
                    )}
                    {profile.lastLogoutAt && (
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <span className="text-sm font-semibold text-gray-600">Last Logout</span>
                        <p className="text-gray-800 mt-1">{formatDate(profile.lastLogoutAt)}</p>
                      </div>
                    )}
                    {profile.isLoggedIn !== undefined && (
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <span className="text-sm font-semibold text-gray-600">Status</span>
                        <p className="text-gray-800 mt-1 flex items-center gap-2">
                          <span className={`w-3 h-3 rounded-full ${profile.isLoggedIn ? 'bg-green-500' : 'bg-red-500'}`}></span>
                          {profile.isLoggedIn ? 'Active' : 'Inactive'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Permissions Section */}
              {profile.permissions && Object.keys(profile.permissions).length > 0 && (
                <div className="border-t pt-6">
                  <button
                    onClick={() => setShowPermissions(!showPermissions)}
                    className="flex items-center justify-between w-full p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-blue-600" />
                      <span className="text-lg font-semibold text-gray-800">
                        Permissions ({getPermissionEntries().length})
                      </span>
                    </div>
                    {showPermissions ? (
                      <ChevronUp className="w-5 h-5 text-gray-600" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-600" />
                    )}
                  </button>

                  {showPermissions && (
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                      {getPermissionEntries().map(([key, value]) => (
                        <div
                          key={key}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <span className="text-sm font-medium text-gray-700 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                          <div className="relative inline-block w-12 h-6">
                            <input
                              type="checkbox"
                              checked={Boolean(value)}
                              readOnly
                              disabled
                              className="sr-only"
                            />
                            <div
                              className={`block w-12 h-6 rounded-full cursor-not-allowed ${
                                value ? 'bg-green-400' : 'bg-gray-300'
                              }`}
                            >
                              <div
                                className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                                  value ? 'transform translate-x-6' : ''
                                }`}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center py-20">
              <p className="text-gray-600">No profile data available</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
