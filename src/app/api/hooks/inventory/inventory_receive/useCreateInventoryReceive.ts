import { useMutation } from '@tanstack/react-query';

import { InventoryReceiveItemProperty } from '@/helpers/utils/inventory/inventory_receive_item';
import AxiosService from '@/services/axiosService';

export const useCreateInventoryReceive = () => {
  return useMutation({
    mutationKey: ['createInventoryReceive'],
    mutationFn: async (data: InventoryReceiveItemProperty) => {
      const response = await AxiosService.AxiosServiceInventory.post(
        'receive',
        data,
      );
      return response.data;
    },
  });
};
