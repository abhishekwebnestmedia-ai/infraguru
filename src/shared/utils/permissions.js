// Centralized permission mapping and helpers

// Map app features to backend permission keys (as per backend payload)
export const FEATURE_PERMISSIONS = {
  dashboard: 'dashboard',
  teamDashboard: 'teamdashboard',
  teamManagement: 'teammanagment',
  leads: 'leads',
  leadUpload: 'leadUpload',
  broadcast: 'boradcast',
  projects: 'projectdev',
  agents: 'agents',
  agentsManagement: 'agentsmanagment',
};

export function getPermissions(user) {
  if (!user) return {};
  // Try common shapes
  const direct = user.permissions;
  const profile = user.profile?.permissions;
  const nestedA = user.data?.permissions;
  const nestedB = user.user?.permissions;
  const altCase = user.Permissions;
  const perms = direct || profile || nestedA || nestedB || altCase || {};
  // Ensure it's a plain object
  return (perms && typeof perms === 'object' && !Array.isArray(perms)) ? perms : {};
}

function getRole(user) {
  if (!user) return undefined;
  return (
    user.role ||
    user.profile?.role ||
    user.data?.role ||
    user.user?.role ||
    (user.isAdmin ? 'admin' : undefined)
  );
}

export function canAccess(feature, user) {
  // Admin bypass
  const role = getRole(user);
  if (role === 'admin' || user?.isAdmin === true) return true;

  const perms = getPermissions(user);
  const key = FEATURE_PERMISSIONS[feature];
  if (!key) {
    // If feature not mapped, deny by default (non-admin)
    return false;
  }
  const val = perms[key];
  // Accept boolean true, string 'true'/'1', number 1
  if (val === true) return true;
  if (typeof val === 'string') return val.toLowerCase() === 'true' || val === '1';
  if (typeof val === 'number') return val === 1;
  return false;
}

export function hasAny(features = [], user) {
  return features.some((f) => canAccess(f, user));
}

export function hasAll(features = [], user) {
  return features.every((f) => canAccess(f, user));
}
