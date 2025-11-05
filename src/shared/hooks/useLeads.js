import { useQuery } from '@tanstack/react-query'
import api from '../services/apiService'

// Custom hook to fetch leads data
export const useLeads = (options = {}) => {
  return useQuery({
    queryKey: ['leads'],
    queryFn: async () => {
      const response = await api.get('/lead/getlead')
      return response.data
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    ...options
  })
}

export default useLeads
