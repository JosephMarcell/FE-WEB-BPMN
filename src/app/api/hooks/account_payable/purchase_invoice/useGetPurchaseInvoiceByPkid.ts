import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetPurchaseInvoiceByPkid = (pkid: number) => {
  return useQuery({
    queryKey: ['purchaseInvoice', pkid],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceAccountPayable.get(
        `purchaseInvoice/${pkid}`,
      );
      return data.data;
    },
  });
};
