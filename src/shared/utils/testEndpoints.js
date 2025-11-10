// Test file to check available API endpoints
// This can be deleted after we identify the correct endpoints

import api from '../services/apiService';

export const testEndpoints = async () => {
  const endpoints = [
    '/groups',
    '/teams', 
    '/broadcasts',
    '/messages',
    '/auth/teams',
    '/users',
  // '/broadcast/groups', // removed: endpoint does not exist on backend
    '/broadcast/messages'
  ];

  console.log('Testing API endpoints...');
  
  for (const endpoint of endpoints) {
    try {
      const response = await api.get(endpoint);
      console.log(`✅ ${endpoint} - Works:`, response.data);
    } catch (error) {
      console.log(`❌ ${endpoint} - Error:`, error.response?.status, error.response?.statusText);
    }
  }
};

// Call this function from console: testEndpoints()
export default testEndpoints;