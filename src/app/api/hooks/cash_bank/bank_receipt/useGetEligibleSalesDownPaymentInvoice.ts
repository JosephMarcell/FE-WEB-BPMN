import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetEligibleSalesDownPaymentInvoice = () => {
  return useQuery({
    queryKey: ['eligibleSalesDownPaymentInvoice'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceCashBank.get(
        'bankReceipt/eligible-dp-invoices',
      );
      return data.data;
    },
  });
};
