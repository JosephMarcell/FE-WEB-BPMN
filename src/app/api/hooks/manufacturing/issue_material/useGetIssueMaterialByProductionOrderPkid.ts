import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetIssueMaterialByProductionOrderPkid = (
  pkid: number,
  enabled = true,
) => {
  return useQuery({
    queryKey: ['listIssueMaterialDetail'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceManufacturing.get(
        `issue_material/production_order/${pkid}`,
      );

      return data.data;
    },
    enabled: enabled,
  });
};
