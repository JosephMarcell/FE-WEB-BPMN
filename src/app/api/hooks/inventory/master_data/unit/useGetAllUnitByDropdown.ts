import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetAllUnitByDropdown = () => {
  return useQuery({
    queryKey: ['listUnitByDropdown'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceInventory.get(
        'unit/dropdown/',
      );
      return data.data;
    },
  });
};
