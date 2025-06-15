import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetAllInventoryWarehouse = () => {
  return useQuery({
    queryKey: ['listItemWarehouse'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceInventory.get(
        'itemWarehouse/',
      );
      return data.data;
    },
  });
};
