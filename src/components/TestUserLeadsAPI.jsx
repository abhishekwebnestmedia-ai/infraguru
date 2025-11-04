import React from 'react';
import api from '../services/apiService';

const TestUserLeadsAPI = () => {
  const testDifferentEndpoints = async () => {
    const testCases = [
      // Different endpoint variations
      { endpoint: '/lead/userbasedlead', params: { username: 'Shashank' } },
      { endpoint: '/lead/userbasedlead', params: { user: 'Shashank' } },
      { endpoint: '/lead/userbasedlead', params: { name: 'Shashank' } },
      { endpoint: '/lead/user-based-lead', params: { username: 'Shashank' } },
      { endpoint: '/leads/userbasedlead', params: { username: 'Shashank' } },
      { endpoint: '/lead/getlead', params: { username: 'Shashank' } },
      { endpoint: '/lead/getlead', params: { assignedTo: 'Shashank' } },
      { endpoint: '/lead/getlead', params: { capturedBy: 'Shashank' } },
    ];

    console.log('🧪 Testing different API endpoints and parameters...');
    
    for (const testCase of testCases) {
      try {
        console.log(`\n📡 Testing: ${testCase.endpoint} with params:`, testCase.params);
        const response = await api.get(testCase.endpoint, { params: testCase.params });
        console.log(`✅ SUCCESS: ${testCase.endpoint}`, response.data);
      } catch (error) {
        console.log(`❌ FAILED: ${testCase.endpoint} - ${error.response?.status} ${error.response?.statusText}`);
      }
    }
  };

  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <h3 className="font-bold text-blue-800 mb-2">🧪 API Testing Tool</h3>
      <p className="text-blue-700 mb-3">Click to test different API endpoints and find the working one</p>
      <button 
        onClick={testDifferentEndpoints}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Test API Endpoints
      </button>
      <p className="text-sm text-blue-600 mt-2">Check browser console for results</p>
    </div>
  );
};

export default TestUserLeadsAPI;