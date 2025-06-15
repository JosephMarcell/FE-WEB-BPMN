import { useMutation } from '@tanstack/react-query';

import { PurchaseOrderProperty } from '@/helpers/utils/purchasing/purchase_order';
import AxiosService from '@/services/axiosService';

export const useCreatePurchaseOrder = () => {
  return useMutation({
    mutationKey: ['createPurchaseOrder'],
    mutationFn: async (data: PurchaseOrderProperty) => {
      const response = await AxiosService.AxiosServicePurchasing.post(
        'purchaseOrder/',
        data,
      );
      return response.data;
    },
  });
};
