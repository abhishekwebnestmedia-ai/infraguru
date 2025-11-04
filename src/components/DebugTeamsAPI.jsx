import React, { useEffect } from 'react';
import api from '../services/apiService';

const DebugTeamsAPI = () => {
  useEffect(() => {
    const testAPI = async () => {
      try {
        console.log('Testing /auth/teams API...');
        const response = await api.get('/auth/teams');
        console.log('Full API Response:', response);
        console.log('Response Data:', response.data);
        
        if (response.data?.users && response.data.users.length > 0) {
          console.log('First User Object:', response.data.users[0]);
          console.log('Available Fields in User Object:', Object.keys(response.data.users[0]));
        }
      } catch (error) {
        console.error('Error testing API:', error);
      }
    };

    testAPI();
  }, []);

  return (
    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <h3 className="font-bold text-yellow-800">Debug: API Testing</h3>
      <p className="text-yellow-700">Check the browser console for API response details</p>
    </div>
  );
};

export default DebugTeamsAPI;