import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetTransferMaterialByProductionOrderPkid = (
  pkid: number,
  enabled = true,
) => {
  return useQuery({
    queryKey: ['listTransferMaterialDetail'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceManufacturing.get(
        `transfer_material/production_order/${pkid}`,
      );

      return data.data;
    },
    enabled: enabled,
  });
};
