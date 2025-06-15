import { useMutation } from '@tanstack/react-query';

import { InventoryWarehouse } from '@/helpers/utils/inventory/inventory_warehouse';
import AxiosService from '@/services/axiosService';

export const useCreateItemWarehouse = () => {
  return useMutation({
    mutationKey: ['createItemWarehouse'],
    mutationFn: async (data: InventoryWarehouse) => {
      const response = await AxiosService.AxiosServiceInventory.post(
        'itemWarehouse/',
        data,
      );
      return response.data;
    },
  });
};
