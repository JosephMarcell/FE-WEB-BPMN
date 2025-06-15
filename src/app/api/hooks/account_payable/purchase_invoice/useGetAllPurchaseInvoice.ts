import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetAllPurchaseInvoice = () => {
  return useQuery({
    queryKey: ['listPurchaseInvoice'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceAccountPayable.get(
        'purchaseInvoice/',
      );
      return data.data;
    },
  });
};
