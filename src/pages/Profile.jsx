import React, { useState, useEffect } from 'react';
import { ArrowLeft, Mail, Phone, MapPin, IdCard, Briefcase, Shield, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/apiService';
import { toast } from 'react-toastify';
import PermissionsModal from '../components/PermissionsModal';

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

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

  const getPermissionCount = () => {
    if (!profile?.permissions || typeof profile.permissions !== 'object') {
      return 0;
    }
    return Object.keys(profile.permissions).length;
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h2 className="text-2xl font-bold text-gray-800">Profile</h2>
        </div>
        <button
          onClick={fetchProfile}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="bg-white rounded-2xl shadow-sm p-12">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading profile...</p>
            </div>
          </div>
        </div>
      ) : error ? (
        <div className="bg-white rounded-2xl shadow-sm p-12">
          <div className="flex items-center justify-center">
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
        </div>
      ) : profile ? (
        <div className="space-y-6">
          {/* Profile Header with Avatar */}
          <div className="bg-white rounded-2xl shadow-sm p-8">
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
          </div>

          {/* Basic Information */}
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Basic Information</h3>
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
          </div>

          {/* Additional Information */}
          {(profile.firstLoginAt || profile.lastLogoutAt || profile.isLoggedIn !== undefined) && (
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Activity</h3>
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
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Permissions</h3>
                    <p className="text-sm text-gray-600">
                      {getPermissionCount()} permissions configured
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPermissionsModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Edit Permissions
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm p-12">
          <div className="flex items-center justify-center">
            <p className="text-gray-600">No profile data available</p>
          </div>
        </div>
      )}

      {/* Permissions Modal */}
      <PermissionsModal
        isOpen={showPermissionsModal}
        onClose={() => setShowPermissionsModal(false)}
        profile={profile}
        onSuccess={fetchProfile}
      />
    </div>
  );
};

export default Profile;
