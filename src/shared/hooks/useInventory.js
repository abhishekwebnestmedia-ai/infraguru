import { useQuery } from '@tanstack/react-query'
import api from '../services/apiService'

// useInventory hook for fetching inventory data
export const useInventory = ({ queryOptions } = {}) => {
  return useQuery({
    queryKey: ['inventory'],
    queryFn: async () => {
      const response = await api.get('/inventory');
      return response.data;
    },
    staleTime: 2 * 60 * 1000,
    cacheTime: 5 * 60 * 1000,
    retry: 2,
    ...queryOptions
  });
};

export default useInventory;
