import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetEligibleSalesInvoice = () => {
  return useQuery({
    queryKey: ['eligibleSalesInvoice'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceCashBank.get(
        'bankReceipt/eligible-invoices',
      );
      return data.data;
    },
  });
};
