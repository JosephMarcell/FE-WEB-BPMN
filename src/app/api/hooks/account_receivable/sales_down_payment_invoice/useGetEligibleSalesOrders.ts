import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetEligibleSalesOrders = () => {
  return useQuery({
    queryKey: ['getEligibleSalesOrders'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceAccountReceivable.get(
        'salesDownPaymentInvoice/eligibleSalesOrders',
      );
      return data.data;
    },
  });
};
