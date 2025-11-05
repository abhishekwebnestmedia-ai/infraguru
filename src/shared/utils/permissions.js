// Centralized permission mapping and helpers

export const FEATURE_PERMISSIONS = {
  dashboard: 'dashboard',
  teamDashboard: 'myTeam',
  leads: 'allLeads',
  projects: 'projectsWorking',
  agents: 'myTeam',
  broadcast: 'superAdmin',
};

export function getPermissions(user) {
  return (user && user.permissions) || {};
}

export function canAccess(feature, user) {
  const perms = getPermissions(user);
  const key = FEATURE_PERMISSIONS[feature];
  if (!key) {
    // If feature not mapped, allow admins by default, deny users
    return user?.role === 'admin';
  }
  return Boolean(perms[key]);
}

export function hasAny(features = [], user) {
  return features.some((f) => canAccess(f, user));
}

export function hasAll(features = [], user) {
  return features.every((f) => canAccess(f, user));
}
