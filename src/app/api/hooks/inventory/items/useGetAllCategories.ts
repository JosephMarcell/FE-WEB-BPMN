import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetAllCategories = () => {
  return useQuery({
    queryKey: ['listCategories'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceInventory.get(
        'items/categories/',
      );
      return data.data;
    },
  });
};
