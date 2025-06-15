import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetInventoryTransferByPkid = (
  pkid: string | number,
  enabled = true,
) => {
  return useQuery({
    queryKey: [pkid, 'inventoryTransfer'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceInventory.get(
        `transfer/${pkid}`,
      );
      return data.data;
    },
    enabled: enabled,
  });
};
