import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetAllItemForDropdownByCategory = (
  item_category_pkid: string | number,
) => {
  return useQuery({
    queryKey: ['Item by category', item_category_pkid],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceInventory.get(
        `item/dropdown/category/${item_category_pkid}`,
      );
      return data.data;
    },
  });
};
