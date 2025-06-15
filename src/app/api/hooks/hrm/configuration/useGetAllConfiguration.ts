import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetAllConfiguration = () => {
  return useQuery({
    queryKey: ['listConfiguration'],
    queryFn: async () => {
      try {
        const response = await AxiosService.AxiosServiceHRM.get(
          'configuration/',
        );
        const { data } = response;

        // Check if data is an object
        if (data && typeof data === 'object' && !Array.isArray(data)) {
          // alert(JSON.stringify(data))
          return data.data;
        }

        throw new Error('Configuration data is not in the expected format');
      } catch (error) {
        throw new Error('Failed to fetch configuration');
      }
    },
  });
};
