import { useMutation } from '@tanstack/react-query';

import { PurchaseInvoiceProperty } from '@/helpers/utils/account_payable/purchase_invoice';
import AxiosService from '@/services/axiosService';

export const useCreatePurchaseInvoice = () => {
  return useMutation({
    mutationKey: ['createPurchaseInvoice'],
    mutationFn: async (data: PurchaseInvoiceProperty) => {
      const response = await AxiosService.AxiosServiceAccountPayable.post(
        'purchaseInvoice/',
        data,
      );
      return response.data;
    },
  });
};
