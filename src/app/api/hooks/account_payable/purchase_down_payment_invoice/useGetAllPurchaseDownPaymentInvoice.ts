import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetAllPurchaseDownPaymentInvoice = () => {
  return useQuery({
    queryKey: ['listPurchaseDownPaymentInvoice'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceAccountPayable.get(
        'purchaseDownPaymentInvoice/',
      );
      return data.data;
    },
  });
};
