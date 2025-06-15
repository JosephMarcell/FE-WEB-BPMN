import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetAllSalesDownPaymentInvoice = () => {
  return useQuery({
    queryKey: ['listSalesDownPaymentInvoice'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceAccountReceivable.get(
        'salesDownPaymentInvoice/',
      );
      return data.data;
    },
  });
};
