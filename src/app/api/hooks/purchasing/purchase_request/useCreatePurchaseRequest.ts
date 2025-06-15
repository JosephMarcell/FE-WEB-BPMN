import { useMutation } from '@tanstack/react-query';

import { PurchaseRequestProperty } from '@/helpers/utils/purchasing/purchase_request';
import AxiosService from '@/services/axiosService';

export const useCreatePurchaseRequest = () => {
  return useMutation({
    mutationKey: ['createPurchaseRequest'],
    mutationFn: async (data: PurchaseRequestProperty) => {
      const response = await AxiosService.AxiosServicePurchasing.post(
        'purchaseRequest/',
        data,
      );
      return response.data;
    },
  });
};
