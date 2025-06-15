import { useMutation } from '@tanstack/react-query';

import { PurchaseDownPaymentInvoiceProperty } from '@/helpers/utils/account_payable/purchase_down_payment_invoice';
import AxiosService from '@/services/axiosService';

export const useCreatePurchaseDownPaymentInvoice = () => {
  return useMutation({
    mutationKey: ['createPurchaseDownPaymentInvoice'],
    mutationFn: async (data: PurchaseDownPaymentInvoiceProperty) => {
      const response = await AxiosService.AxiosServiceAccountPayable.post(
        'purchaseDownPaymentInvoice/',
        data,
      );
      return response.data;
    },
  });
};
