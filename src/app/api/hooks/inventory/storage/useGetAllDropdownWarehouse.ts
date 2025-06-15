import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetAllDropdownWarehouse = () => {
  return useQuery({
    queryKey: ['listDropdownWarehouse'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceInventory.get(
        'warehouse/dropdown',
      );
      return data.data;
    },
  });
};
