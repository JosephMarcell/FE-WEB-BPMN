import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetAllProductionOrder = () => {
  return useQuery({
    queryKey: ['listProductionOrder'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceManufacturing.get(
        'production_order/',
      );
      return data.data;
    },
  });
};
