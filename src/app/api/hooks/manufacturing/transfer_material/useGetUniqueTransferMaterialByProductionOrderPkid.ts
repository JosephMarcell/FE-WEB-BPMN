import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetUniqueTransferMaterialByProductionOrderPkid = () => {
  return useQuery({
    queryKey: ['listTransferMaterial'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceManufacturing.get(
        'transfer_material/unique/',
      );

      return data.data;
    },
  });
};
