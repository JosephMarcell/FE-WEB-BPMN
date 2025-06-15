import { useMutation } from '@tanstack/react-query';

import { InventoryReceiveItemProperty } from '@/helpers/utils/inventory/inventory_receive_item';
import AxiosService from '@/services/axiosService';

interface Update {
  pkid: number;
  data: InventoryReceiveItemProperty;
}
export const useUpdateInventoryReceive = () => {
  return useMutation({
    mutationKey: ['useUpdateInventoryReceive'],
    mutationFn: async ({ pkid, data }: Update) => {
      const response = await AxiosService.AxiosServiceInventory.put(
        `receive/${pkid}`,
        data,
      );
      return response.data;
    },
  });
};
