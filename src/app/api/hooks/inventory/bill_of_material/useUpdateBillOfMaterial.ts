import { useMutation } from '@tanstack/react-query';

import { BillOfMaterialProperty } from '@/helpers/utils/inventory/bill_of_materials';
import AxiosService from '@/services/axiosService';

interface Update {
  pkid: number;
  data: BillOfMaterialProperty;
}
export const useUpdateBillOfMaterial = () => {
  return useMutation({
    mutationKey: ['useUpdateBillOfMaterial'],
    mutationFn: async ({ pkid, data }: Update) => {
      const response = await AxiosService.AxiosServiceInventory.put(
        `bom/${pkid}`,
        data,
      );
      return response.data;
    },
  });
};
