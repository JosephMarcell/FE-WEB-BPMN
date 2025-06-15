import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetProductionOrderByPkid = (pkid: number, enabled = true) => {
  return useQuery({
    queryKey: [pkid],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceManufacturing.get(
        `production_order/${pkid}`,
      );
      return data.data;
    },
    enabled: enabled,
  });
};
