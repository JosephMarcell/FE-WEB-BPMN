import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetLatestSalesInvoiceBySalesOrderCode = (
  salesOrderCode: string,
) => {
  return useQuery({
    queryKey: ['getLatestSalesInvoiceBySalesOrderCode', salesOrderCode],
    queryFn: async () => {
      if (!salesOrderCode) {
        return;
      }
      const { data } = await AxiosService.AxiosServiceAccountReceivable.get(
        `salesInvoice/latest/${salesOrderCode}`,
      );
      return data;
    },
    enabled: !!salesOrderCode,
  });
};
