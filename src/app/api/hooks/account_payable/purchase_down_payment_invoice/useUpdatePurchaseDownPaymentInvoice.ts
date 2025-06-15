import { useMutation } from '@tanstack/react-query';

import { PurchaseDownPaymentInvoiceUpdateProperty } from '@/helpers/utils/account_payable/purchase_down_payment_invoice';
import AxiosService from '@/services/axiosService';

export const useUpdatePurchaseDownPaymentInvoice = () => {
  return useMutation({
    mutationKey: ['updatePurchaseDownPaymentInvoice'],
    mutationFn: async ({
      data,
      pkid,
    }: {
      data: Partial<PurchaseDownPaymentInvoiceUpdateProperty>;
      pkid: number;
    }) => {
      const response = await AxiosService.AxiosServiceAccountPayable.put(
        `purchaseDownPaymentInvoice/${pkid}`,
        data,
      );
      return response.data;
    },
  });
};
