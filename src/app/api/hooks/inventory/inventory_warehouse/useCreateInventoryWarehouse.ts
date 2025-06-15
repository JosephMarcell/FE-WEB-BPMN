import { useMutation } from '@tanstack/react-query';

import { InventoryWarehouse } from '@/helpers/utils/inventory/inventory_warehouse';
import AxiosService from '@/services/axiosService';

export const useCreateInventoryWarehouse = () => {
  return useMutation({
    mutationKey: ['createInventoryWarehouse'],
    mutationFn: async (data: InventoryWarehouse) => {
      const response = await AxiosService.AxiosServiceInventory.post(
        'itemWarehouse/',
        data,
      );
      return response.data;
    },
  });
};
