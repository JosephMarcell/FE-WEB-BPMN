import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetPurchaseDownPaymentInvoiceByPkid = (pkid: number) => {
  return useQuery({
    queryKey: ['purchaseDownPaymentInvoice', pkid],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceAccountPayable.get(
        `purchaseDownPaymentInvoice/${pkid}`,
      );
      return data.data;
    },
  });
};
