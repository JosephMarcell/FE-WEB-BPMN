import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetLatestPurchaseDownPaymentInvoiceByPurchaseOrderCode = (
  purchaseOrderCode: string,
) => {
  return useQuery({
    queryKey: [
      'getLatestPurchaseDownPaymentInvoiceByPurchaseOrderCode',
      purchaseOrderCode,
    ],
    queryFn: async () => {
      if (!purchaseOrderCode) {
        return;
      }
      const { data } = await AxiosService.AxiosServiceAccountPayable.get(
        `purchaseDownPaymentInvoice/latest/${purchaseOrderCode}`,
      );
      return data;
    },
    enabled: !!purchaseOrderCode,
  });
};
