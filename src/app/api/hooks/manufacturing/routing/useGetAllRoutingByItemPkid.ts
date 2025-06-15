import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetAllRoutingByItemPkid = (pkid: number, enabled = true) => {
  return useQuery({
    queryKey: [pkid],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceManufacturing.get(
        `routing/item/${pkid}`,
      );
      return data.data;
    },
    enabled: enabled,
  });
};
