import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetEligiblePurchaseInvoice = () => {
  return useQuery({
    queryKey: ['eligiblePurchaseInvoice'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceCashBank.get(
        'cashDisbursement/eligible-invoices',
      );
      return data.data;
    },
  });
};
