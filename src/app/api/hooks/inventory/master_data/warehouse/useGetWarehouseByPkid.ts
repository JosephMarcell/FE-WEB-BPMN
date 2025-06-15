import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetWarehouseByPkid = (
  pkid: string | number,
  enabled = true,
) => {
  return useQuery({
    queryKey: [pkid],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceInventory.get(
        `warehouse/${pkid}`,
      );
      return data.data;
    },
    enabled: enabled,
  });
};
