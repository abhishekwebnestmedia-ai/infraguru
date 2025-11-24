import axios from "axios";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: "https://nesthub.webnestmedia.online/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000, // 15 second timeout
  withCredentials: true, // Allow cookies for HttpOnly cookie support
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage (fallback if not using HttpOnly cookies)
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and auth management
api.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (import.meta.env.DEV) {
      console.log(`✅ API Success: ${response.config?.method?.toUpperCase()} ${response.config?.url} - Status: ${response.status}`);
    }
    // Optional success toast when explicitly requested
    try {
      if (response?.config?.meta?.successToast && typeof window !== 'undefined' && window?.toast) {
        const msg = typeof response?.data?.message === 'string' ? response.data.message : 'Success';
        window.toast.success(msg);
      }
  } catch (e) { void e; }
    return response;
  },
  (error) => {
      // Log errors in development with more detail unless the request asked to suppress logs.
      // This lets callers make expected-but-nonfatal requests (eg. feature probes) without
      // flooding the console with HTML error pages from the server.
      const suppress = error?.config?.meta?.suppressErrorLog;
      if (import.meta.env.DEV && !suppress) {
        console.group('🔴 API Error Details');
        console.error('Full Error Object:', error);
        console.error('Status:', error.response?.status || 'No Status');
        console.error('Status Text:', error.response?.statusText || 'No Status Text');
        console.error('URL:', error.config?.url || 'No URL');
        console.error('Method:', error.config?.method?.toUpperCase() || 'No Method');
        console.error('Request Headers:', error.config?.headers || 'No Headers');
        console.error('Response Data:', error.response?.data || 'No Response Data');
        console.error('Response Headers:', error.response?.headers || 'No Response Headers');
      
        if (!error.response) {
          console.error('Network/Connection Error - No response received');
          console.error('Request Object:', error.request);
        }
      
        console.groupEnd();
      }

    // Try surfacing error via toast
    try {
      if (typeof window !== 'undefined' && window?.toast) {
        const serverMsg = error?.response?.data?.message;
        const status = error?.response?.status;
        const msg = serverMsg || (status ? `Request failed with status ${status}` : (error.message || 'Request failed'));
        window.toast.error(msg);
      }
    } catch { /* noop */ }

    // Handle 401 - unauthorized
    if (error.response?.status === 401) {
      console.warn('🔐 Unauthorized - Clearing token and dispatching auth event');
      console.log('🔑 Token before clearing:', localStorage.getItem('authToken') ? 'exists' : 'not found');
      
      // Clear token and redirect to login
      localStorage.removeItem('authToken');
      console.log('🔑 Token after clearing:', localStorage.getItem('authToken') ? 'still exists' : 'cleared');
      
      // Don't redirect here as it might interfere with React Router
      // Let the auth store handle the redirect
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
      console.log('📡 Dispatched auth:unauthorized event');
    }

    return Promise.reject(error);
  }
);

// Token helpers — simple localStorage-backed methods (keep as lightweight helpers)
export const setToken = (token) => {
  localStorage.setItem('authToken', token);
};

export const getToken = () => {
  return localStorage.getItem('authToken');
};

export const removeToken = () => {
  localStorage.removeItem('authToken');
};

// Export only the configured axios instance (default) and token helpers.
// All actual API calls should live in hooks or the AuthContext.
export default api;