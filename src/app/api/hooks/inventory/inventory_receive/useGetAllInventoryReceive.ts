import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetAllInventoryReceive = () => {
  return useQuery({
    queryKey: ['listInventoryReceive'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceInventory.get('receive/');

      return data.data;
    },
  });
};
