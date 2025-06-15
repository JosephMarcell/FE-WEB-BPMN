import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetLatestSalesDownPaymentInvoiceBySalesOrderCode = (
  salesOrderCode: string,
) => {
  return useQuery({
    queryKey: [
      'getLatestSalesDownPaymentInvoiceBySalesOrderCode',
      salesOrderCode,
    ],
    queryFn: async () => {
      if (!salesOrderCode) {
        return;
      }
      const { data } = await AxiosService.AxiosServiceAccountReceivable.get(
        `salesDownPaymentInvoice/latest/${salesOrderCode}`,
      );
      return data;
    },
    enabled: !!salesOrderCode,
  });
};
