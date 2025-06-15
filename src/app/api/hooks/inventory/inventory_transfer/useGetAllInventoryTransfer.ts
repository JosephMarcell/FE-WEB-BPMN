import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetAllInventoryTransfer = () => {
  return useQuery({
    queryKey: ['listInventoryTransfer'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceInventory.get(
        'transfer/',
      );

      return data.data;
    },
  });
};
