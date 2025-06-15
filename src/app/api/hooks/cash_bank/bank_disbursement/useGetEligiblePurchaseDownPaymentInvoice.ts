import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetEligiblePurchaseDownPaymentInvoice = () => {
  return useQuery({
    queryKey: ['eligiblePurchaseDownPaymentInvoice'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceCashBank.get(
        'bankDisbursement/eligible-dp-invoices',
      );
      return data.data;
    },
  });
};
