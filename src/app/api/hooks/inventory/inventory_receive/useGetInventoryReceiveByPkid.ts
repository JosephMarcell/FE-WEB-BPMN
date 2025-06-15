import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetInventoryReceiveByPkid = (
  pkid: string | number,
  enabled = true,
) => {
  return useQuery({
    queryKey: [pkid, 'inventoryReceive'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceInventory.get(
        `receive/${pkid}`,
      );
      return data.data;
    },
    enabled: enabled,
  });
};
