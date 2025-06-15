import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetItemByPkid = (pkid: string | number, enabled = true) => {
  return useQuery({
    queryKey: [pkid],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceInventory.get(
        `item/${pkid}`,
      );
      return data.data;
    },
    enabled: enabled,
  });
};
