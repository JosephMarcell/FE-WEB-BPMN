import { useMutation } from '@tanstack/react-query';

import { SalesInvoiceProperty } from '@/helpers/utils/account_receivable/sales_invoice';
import AxiosService from '@/services/axiosService';

export const useCreateSalesInvoice = () => {
  return useMutation({
    mutationKey: ['createSalesInvoice'],
    mutationFn: async (data: SalesInvoiceProperty) => {
      const response = await AxiosService.AxiosServiceAccountReceivable.post(
        'salesInvoice/',
        data,
      );
      return response.data;
    },
  });
};
