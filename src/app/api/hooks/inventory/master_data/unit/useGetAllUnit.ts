import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetAllUnit = () => {
  return useQuery({
    queryKey: ['listUnit'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceInventory.get('unit/');
      return data.data;
    },
  });
};
