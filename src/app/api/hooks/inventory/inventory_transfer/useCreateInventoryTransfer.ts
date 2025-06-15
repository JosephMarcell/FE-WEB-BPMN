import { useMutation } from '@tanstack/react-query';

import { InventoryTransferItemProperty } from '@/helpers/utils/inventory/inventory_transfer_item';
import AxiosService from '@/services/axiosService';

export const useCreateInventoryTransfer = () => {
  return useMutation({
    mutationKey: ['createInventoryTransfer'],
    mutationFn: async (data: InventoryTransferItemProperty) => {
      const response = await AxiosService.AxiosServiceInventory.post(
        'transfer',
        data,
      );
      return response.data;
    },
  });
};
