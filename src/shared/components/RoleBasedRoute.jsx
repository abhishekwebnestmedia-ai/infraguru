import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * RoleBasedRoute component
 * Handles role-based routing - redirects users based on their role
 * 
 * @param {string} allowedRole - The role required to access this route ('admin' or 'user')
 * @param {React.ReactNode} children - The component to render if role matches
 */
const RoleBasedRoute = ({ allowedRole, children }) => {
  const { user, loading } = useAuth();

  // Show loading state while fetching user data
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If no allowedRole is specified (root route), redirect based on user role
  if (!allowedRole) {
    if (user?.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/user/dashboard" replace />;
    }
  }

  // Check if user has the required role
  const userRole = user?.role;
  
  if (userRole !== allowedRole) {
    // Redirect to appropriate dashboard if role doesn't match
    if (userRole === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/user/dashboard" replace />;
    }
  }

  // Role matches, render children
  return <>{children}</>;
};

export default RoleBasedRoute;
