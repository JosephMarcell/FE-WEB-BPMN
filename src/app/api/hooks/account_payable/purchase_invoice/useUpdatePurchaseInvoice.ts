import { useMutation } from '@tanstack/react-query';

import { PurchaseInvoiceUpdateProperty } from '@/helpers/utils/account_payable/purchase_invoice';
import AxiosService from '@/services/axiosService';

export const useUpdatePurchaseInvoice = () => {
  return useMutation({
    mutationKey: ['updatePurchaseInvoice'],
    mutationFn: async ({
      data,
      pkid,
    }: {
      data: Partial<PurchaseInvoiceUpdateProperty>;
      pkid: number;
    }) => {
      const response = await AxiosService.AxiosServiceAccountPayable.put(
        `purchaseInvoice/${pkid}`,
        data,
      );
      return response.data;
    },
  });
};
