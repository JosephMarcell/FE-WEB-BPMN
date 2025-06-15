import { useMutation } from '@tanstack/react-query';

import { SalesDownPaymentInvoiceUpdateProperty } from '@/helpers/utils/account_receivable/sales_down_payment_invoice';
import AxiosService from '@/services/axiosService';

export const useUpdateSalesDownPaymentInvoice = () => {
  return useMutation({
    mutationKey: ['updateSalesDownPaymentInvoice'],
    mutationFn: async ({
      data,
      pkid,
    }: {
      data: Partial<SalesDownPaymentInvoiceUpdateProperty>;
      pkid: number;
    }) => {
      const response = await AxiosService.AxiosServiceAccountReceivable.put(
        `salesDownPaymentInvoice/${pkid}`,
        data,
      );
      return response.data;
    },
  });
};
