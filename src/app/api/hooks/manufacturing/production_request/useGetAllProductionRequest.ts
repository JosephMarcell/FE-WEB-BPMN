import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetAllProductionRequest = () => {
  return useQuery({
    queryKey: ['listProductionRequest'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceManufacturing.get(
        'production_request/',
      );
      return data.data;
    },
  });
};
