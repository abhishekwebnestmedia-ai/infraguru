import { useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { FEATURE_PERMISSIONS, canAccess, getPermissions, hasAny, hasAll } from '../utils/permissions';

export function usePermissions() {
  const { user } = useAuth();
  const permissions = useMemo(() => getPermissions(user), [user]);

  const hasFeature = (feature) => canAccess(feature, user);
  const any = (features) => hasAny(features, user);
  const all = (features) => hasAll(features, user);

  return { permissions, hasFeature, any, all, FEATURE_PERMISSIONS, user };
}
