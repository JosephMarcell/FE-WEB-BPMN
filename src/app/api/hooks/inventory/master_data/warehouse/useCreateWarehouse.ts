import { useMutation } from '@tanstack/react-query';

import { WarehouseProperty } from '@/helpers/utils/inventory/master_data/warehouse/warehouse';
import AxiosService from '@/services/axiosService';

export const useCreateWarehouse = () => {
  return useMutation({
    mutationKey: ['createWarehouse'],
    mutationFn: async (data: WarehouseProperty) => {
      try {
        //console alert data to front end
        // alert(JSON.stringify(data));
        const response = await AxiosService.AxiosServiceInventory.post(
          'warehouse/',
          data,
        );
        return response.data;
      } catch (error) {
        //console.error(error);
        // return error;
        throw new Error('Error creating Warehouse: ');
      }
    },
  });
};
