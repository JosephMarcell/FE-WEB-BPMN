import { useMutation } from '@tanstack/react-query';

import { BillOfMaterialProperty } from '@/helpers/utils/inventory/bill_of_materials';
import AxiosService from '@/services/axiosService';

export const useCreateBillOfMaterial = () => {
  return useMutation({
    mutationKey: ['createBillOfMaterial'],
    mutationFn: async (data: BillOfMaterialProperty) => {
      const response = await AxiosService.AxiosServiceInventory.post(
        'bom',
        data,
      );
      return response.data;
    },
  });
};
