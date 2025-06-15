import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetAllWarehouse = () => {
  return useQuery({
    queryKey: ['listWarehouse'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceInventory.get(
        'warehouse/',
      );
      return data.data;
    },
  });
};
