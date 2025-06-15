import { useMutation } from '@tanstack/react-query';

import { SalesDownPaymentInvoiceProperty } from '@/helpers/utils/account_receivable/sales_down_payment_invoice';
import AxiosService from '@/services/axiosService';

export const useCreateSalesDownPaymentInvoice = () => {
  return useMutation({
    mutationKey: ['createSalesDownPaymentInvoice'],
    mutationFn: async (data: SalesDownPaymentInvoiceProperty) => {
      const response = await AxiosService.AxiosServiceAccountReceivable.post(
        'salesDownPaymentInvoice/',
        data,
      );
      return response.data;
    },
  });
};
