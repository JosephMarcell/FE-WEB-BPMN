import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetAllInventoryReceiveOnlyHeader = () => {
  return useQuery({
    queryKey: ['listInventoryReceive'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceInventory.get(
        'receive/headers',
      );

      return data.data;
    },
  });
};
