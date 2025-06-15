import { useMutation } from '@tanstack/react-query';

import { WarehouseProperty } from '@/helpers/utils/inventory/master_data/warehouse/warehouse';
import AxiosService from '@/services/axiosService';
interface Update {
  pkid: string | number;
  data: WarehouseProperty;
}
export const useUpdateWarehouse = () => {
  return useMutation({
    mutationKey: ['updateWarehouseByPkid'],
    mutationFn: async ({ pkid, data }: Update) => {
      const response = await AxiosService.AxiosServiceInventory.put(
        `warehouse/${pkid}`,
        data,
      );
      return response.data;
    },
  });
};
