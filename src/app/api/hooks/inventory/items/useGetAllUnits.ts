import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetAllUnits = () => {
  return useQuery({
    queryKey: ['listUnits'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceInventory.get(
        'items/units/',
      );
      return data.data;
    },
  });
};
