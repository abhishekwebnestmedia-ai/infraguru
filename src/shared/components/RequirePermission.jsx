import React from 'react';
import { Navigate } from 'react-router-dom';
import { usePermissions } from '../hooks/usePermissions';

const RequirePermission = ({ feature, children }) => {
  const { hasFeature } = usePermissions();

  if (!hasFeature(feature)) {
    // Redirect to unified dashboard without role prefixes
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default RequirePermission;
