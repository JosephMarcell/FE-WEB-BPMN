import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetAllItemForDropdown = () => {
  return useQuery({
    queryKey: ['listItemForDropdown'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceInventory.get(
        'item/dropdown/',
      );
      return data.data;
    },
  });
};
