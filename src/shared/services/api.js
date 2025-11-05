// Legacy compatibility wrapper — expose only token helpers and axios instance.
// NOTE: Actual API calls should be performed via hooks or AuthContext.
import api, { setToken, getToken, removeToken } from './apiService'

const legacy = {
  // Token helpers
  setAuthToken: setToken,
  getAuthToken: getToken,
  removeAuthToken: removeToken,
  isAuthenticated: () => !!getToken(),
  // Raw axios instance (if someone needs to perform direct calls)
  axios: api,
};

export default legacy;
export { api as axiosInstance };