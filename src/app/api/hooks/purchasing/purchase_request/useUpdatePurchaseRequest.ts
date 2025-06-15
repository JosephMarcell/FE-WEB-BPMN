import { useMutation } from '@tanstack/react-query';

import { PurchaseRequestProperty } from '@/helpers/utils/purchasing/purchase_request';
import AxiosService from '@/services/axiosService';
interface Update {
  pkid: number;
  data: PurchaseRequestProperty;
}
export const useUpdatePurchaseRequest = () => {
  return useMutation({
    mutationKey: ['useUpdatePurchaseRequest'],
    mutationFn: async ({ pkid, data }: Update) => {
      const response = await AxiosService.AxiosServicePurchasing.put(
        `purchaseRequest/${pkid}`,
        data,
      );
      return response.data;
    },
  });
};
