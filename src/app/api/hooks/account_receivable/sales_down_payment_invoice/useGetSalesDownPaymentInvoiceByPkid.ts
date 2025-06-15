import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetSalesDownPaymentInvoiceByPkid = (pkid: number) => {
  return useQuery({
    queryKey: ['salesDownPaymentInvoice', pkid],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceAccountReceivable.get(
        `salesDownPaymentInvoice/${pkid}`,
      );
      return data.data;
    },
  });
};
