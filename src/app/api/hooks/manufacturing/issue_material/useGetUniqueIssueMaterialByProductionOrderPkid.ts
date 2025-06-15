import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetUniqueIssueMaterialByProductionOrderPkid = () => {
  return useQuery({
    queryKey: ['listIssueMaterial'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceManufacturing.get(
        'issue_material/unique/',
      );

      return data.data;
    },
  });
};
