import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetAllReceiveProduct = () => {
  return useQuery({
    queryKey: ['listReceiveProduct'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceManufacturing.get(
        'receive_product/',
      );
      return data.data;
    },
  });
};
