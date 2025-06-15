import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetAllTax = () => {
  return useQuery({
    queryKey: ['listTax'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceInventory.get(
        'items/taxes/',
      );
      return data.data;
    },
  });
};
