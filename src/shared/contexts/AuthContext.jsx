import React, { useState, useEffect, useCallback } from 'react';
import { AuthContext } from './AuthContextDefinition.js';
export { AuthContext };
import api from '../services/apiService';

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper functions for token management
  const getToken = () => localStorage.getItem('authToken');
  const setToken = (token) => localStorage.setItem('authToken', token);
  const removeToken = () => localStorage.removeItem('authToken');

  const logout = useCallback(() => {
    removeToken();
    setIsAuthenticated(false);
    setUser(null);
  }, []);

  useEffect(() => {
    // Check if user is authenticated on component mount and fetch profile
    const init = async () => {
      const token = getToken();
      if (token) {
        setIsAuthenticated(true);
        try {
          const response = await api.get('/auth/profile');
          const profile = response.data?.user || response.data?.profile || response.data;
          // Dev-only: log profile API output for debugging
          if (import.meta?.env?.MODE !== 'production') {
            console.group('[Auth] GET /auth/profile (init)');
            console.log('response.data:', response.data);
            console.groupEnd();
          }
          setUser(profile || null);
        } catch (err) {
          // If fetching profile fails (token invalid), clear token
          console.error('Failed to fetch profile on init:', err);
          removeToken();
          setIsAuthenticated(false);
          setUser(null);
        }
      }
      setLoading(false);
    }

    // Listen for auth unauthorized events from API interceptor
    const handleAuthUnauthorized = () => {
      console.warn('🔐 AuthContext: Received unauthorized event, logging out');
      logout();
    };

    // Add event listener
    window.addEventListener('auth:unauthorized', handleAuthUnauthorized);

    init();

    // Cleanup event listener
    return () => {
      window.removeEventListener('auth:unauthorized', handleAuthUnauthorized);
    };
  }, [logout]);

  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/login', credentials);
      const data = response.data;

      // Assuming the API returns a token field
      if (data.token) {
        setToken(data.token);
        setIsAuthenticated(true);
        // Try to use returned user or fetch profile for fresh data
  const userFromResponse = data.user || data.profile || data.data || null;
        if (import.meta?.env?.MODE !== 'production') {
          console.group('[Auth] POST /auth/login');
          console.log('login response.data:', data);
          console.log('userFromResponse:', userFromResponse);
          console.groupEnd();
        }
        if (userFromResponse) {
          setUser(userFromResponse);
        } else {
          try {
            const profileResponse = await api.get('/auth/profile');
            const profile = profileResponse.data?.user || profileResponse.data?.profile || profileResponse.data;
            if (import.meta?.env?.MODE !== 'production') {
              console.group('[Auth] GET /auth/profile (after login)');
              console.log('profileResponse.data:', profileResponse.data);
              console.groupEnd();
            }
            setUser(profile || null);
          } catch (err) {
            console.warn('Unable to fetch profile after login:', err);
          }
        }
        return { success: true, data };
      } else {
        throw new Error('No token received');
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.response?.data?.message || error.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/register', userData);
      const data = response.data;

      // If registration is successful and returns a token, auto-login
      if (data.token) {
        setToken(data.token);
        setIsAuthenticated(true);
  const userFromResponse = data.user || data.profile || data.data || null;
        if (import.meta?.env?.MODE !== 'production') {
          console.group('[Auth] POST /auth/register');
          console.log('register response.data:', data);
          console.log('userFromResponse:', userFromResponse);
          console.groupEnd();
        }
        if (userFromResponse) {
          setUser(userFromResponse);
        } else {
          try {
            const profileResponse = await api.get('/auth/profile');
            const profile = profileResponse.data?.user || profileResponse.data?.profile || profileResponse.data;
            if (import.meta?.env?.MODE !== 'production') {
              console.group('[Auth] GET /auth/profile (after register)');
              console.log('profileResponse.data:', profileResponse.data);
              console.groupEnd();
            }
            setUser(profile || null);
          } catch (err) {
            console.warn('Unable to fetch profile after register:', err);
          }
        }
      }
      
      return { success: true, data };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.response?.data?.message || error.message };
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (payload) => {
    // payload: { email }
    try {
      setLoading(true);
      const response = await api.post('/auth/forgot-password', payload);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Forgot password error:', error);
      return { success: false, error: error.response?.data?.message || error.message || 'Failed to request password reset' };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (payload) => {
    // payload: { token, newPassword }
    try {
      setLoading(true);
      const response = await api.post('/auth/reset-password', payload);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Reset password error:', error);
      return { success: false, error: error.response?.data?.message || error.message || 'Failed to reset password' };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    register,
    forgotPassword,
    resetPassword,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};