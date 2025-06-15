import { useMutation } from '@tanstack/react-query';

import { ItemWarehouseProperty } from '@/helpers/utils/inventory/item_warehouse/itemWarehouse';
import AxiosService from '@/services/axiosService';
interface Update {
  pkid: string | number;
  data: ItemWarehouseProperty;
}
export const useUpdateItemWarehouse = () => {
  return useMutation({
    mutationKey: ['updateItemWarehouseByPkid'],
    mutationFn: async ({ pkid, data }: Update) => {
      const response = await AxiosService.AxiosServiceInventory.put(
        `itemWarehouse/${pkid}`,
        data,
      );
      return response.data;
    },
  });
};
