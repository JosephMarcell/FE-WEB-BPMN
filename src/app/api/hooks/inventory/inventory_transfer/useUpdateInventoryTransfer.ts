import { useMutation } from '@tanstack/react-query';

import { InventoryTransferItemProperty } from '@/helpers/utils/inventory/inventory_transfer_item';
import AxiosService from '@/services/axiosService';

interface Update {
  pkid: number;
  data: InventoryTransferItemProperty;
}
export const useUpdateInventoryTransfer = () => {
  return useMutation({
    mutationKey: ['useUpdateInventoryTransfer'],
    mutationFn: async ({ pkid, data }: Update) => {
      const response = await AxiosService.AxiosServiceInventory.put(
        `transfer/${pkid}`,
        data,
      );
      return response.data;
    },
  });
};
