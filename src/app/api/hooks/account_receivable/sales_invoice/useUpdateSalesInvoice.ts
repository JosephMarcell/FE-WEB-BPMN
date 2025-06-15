import { useMutation } from '@tanstack/react-query';

import { SalesInvoiceUpdateProperty } from '@/helpers/utils/account_receivable/sales_invoice';
import AxiosService from '@/services/axiosService';

export const useUpdateSalesInvoice = () => {
  return useMutation({
    mutationKey: ['updateSalesInvoice'],
    mutationFn: async ({
      data,
      pkid,
    }: {
      data: Partial<SalesInvoiceUpdateProperty>;
      pkid: number;
    }) => {
      const response = await AxiosService.AxiosServiceAccountReceivable.put(
        `salesInvoice/${pkid}`,
        data,
      );
      return response.data;
    },
  });
};
