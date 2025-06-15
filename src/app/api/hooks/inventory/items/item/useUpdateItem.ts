import { useMutation } from '@tanstack/react-query';

import { ItemProperty } from '@/helpers/utils/inventory/item/item';
import AxiosService from '@/services/axiosService';
interface Update {
  pkid: string | number;
  data: ItemProperty;
}
export const useUpdateItem = () => {
  return useMutation({
    mutationKey: ['updateItemByPkid'],
    mutationFn: async ({ pkid, data }: Update) => {
      const response = await AxiosService.AxiosServiceInventory.put(
        `item/${pkid}`,
        data,
      );
      return response.data;
    },
  });
};
