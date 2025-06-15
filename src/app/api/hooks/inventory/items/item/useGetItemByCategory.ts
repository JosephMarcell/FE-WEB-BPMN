import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetItemByCategory = (item_category_pkid: string | number) => {
  return useQuery({
    queryKey: [item_category_pkid],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceInventory.get(
        `item/category/${item_category_pkid}`,
      );
      return data.data;
    },
  });
};
