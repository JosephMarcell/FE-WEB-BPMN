import { useMutation } from '@tanstack/react-query';

import { PurchaseOrderProperty } from '@/helpers/utils/purchasing/purchase_order';
import AxiosService from '@/services/axiosService';
interface Update {
  pkid: number;
  data: PurchaseOrderProperty;
}
export const useUpdatePurchaseOrder = () => {
  return useMutation({
    mutationKey: ['useUpdatePurchaseOrder'],
    mutationFn: async ({ pkid, data }: Update) => {
      const response = await AxiosService.AxiosServicePurchasing.put(
        `purchaseOrder/${pkid}`,
        data,
      );
      return response.data;
    },
  });
};
