import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetAllDelayedProduction = () => {
  return useQuery({
    queryKey: ['listDelayedProduction'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceInventory.get(
        'delayed-production/',
      );
      return data.data;
    },
  });
};
