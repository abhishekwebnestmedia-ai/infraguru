import { useQuery } from '@tanstack/react-query'
import api from '../services/apiService'

// useLeads now supports optional user-based filtering via username
// If username is provided, it hits /lead/userbasedlead?username=Name
// Else it falls back to /lead/getlead
export const useLeads = ({ username, queryOptions } = {}) => {
  return useQuery({
    queryKey: ['leads', username || 'all'],
    queryFn: async () => {
      const endpoint = username ? '/lead/userbasedlead' : '/lead/getlead';
      const response = await api.get(endpoint, { params: username ? { username } : undefined });
      return response.data;
    },
    staleTime: 2 * 60 * 1000,
    cacheTime: 5 * 60 * 1000,
    retry: 2,
    ...queryOptions
  });
};

export default useLeads;
