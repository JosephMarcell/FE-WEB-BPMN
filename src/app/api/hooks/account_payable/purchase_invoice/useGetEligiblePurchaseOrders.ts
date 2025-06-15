import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetEligiblePurchaseOrders = () => {
  return useQuery({
    queryKey: ['getEligiblePurchaseOrders'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceAccountPayable.get(
        'purchaseInvoice/eligiblePurchaseOrders',
      );
      return data.data;
    },
  });
};
