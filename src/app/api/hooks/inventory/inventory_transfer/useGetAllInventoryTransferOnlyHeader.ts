import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetAllInventoryTransferOnlyHeader = () => {
  return useQuery({
    queryKey: ['listInventoryTransfer'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceInventory.get(
        'transfer/headers',
      );

      return data.data;
    },
  });
};
