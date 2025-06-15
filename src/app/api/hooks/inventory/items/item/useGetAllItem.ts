import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetAllItem = () => {
  return useQuery({
    queryKey: ['listItem'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceInventory.get('item/');
      return data.data;
    },
  });
};
