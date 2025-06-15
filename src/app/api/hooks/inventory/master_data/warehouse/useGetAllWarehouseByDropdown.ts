import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetAllWarehouseByDropdown = () => {
  return useQuery({
    queryKey: ['listWarehouseByDropdown'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceInventory.get(
        'warehouse/dropdown/',
      );
      return data.data;
    },
  });
};
