// Deprecated: `authStore` has been migrated to `AuthContext`.
//
// If any code still imports `useAuthStore`, this stub will throw at runtime
// to make the migration explicit. Replace usages with the `useAuth` hook:
//
//   import useAuth from '../hooks/useAuth'
//   const { user, login, logout } = useAuth()
//
export function useAuthStore() {
  throw new Error(
    'useAuthStore has been removed. Migrate to AuthContext/useAuth. See src/contexts/AuthContext.jsx and src/hooks/useAuth.js'
  );
}