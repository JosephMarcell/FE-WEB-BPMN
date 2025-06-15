import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetEligibleSalesOrders = () => {
  return useQuery({
    queryKey: ['eligibleSalesOrders'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceAccountReceivable.get(
        'salesInvoice/eligibleSalesOrders',
      );
      return data.data;
    },
  });
};
