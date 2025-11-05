import React from 'react';
import { Navigate } from 'react-router-dom';
import { usePermissions } from '../hooks/usePermissions';

const RequirePermission = ({ feature, children }) => {
  const { hasFeature, user } = usePermissions();

  if (!hasFeature(feature)) {
    // Redirect to appropriate dashboard
    const base = user?.role === 'admin' ? '/admin' : '/user';
    return <Navigate to={`${base}/dashboard`} replace />;
  }

  return <>{children}</>;
};

export default RequirePermission;
