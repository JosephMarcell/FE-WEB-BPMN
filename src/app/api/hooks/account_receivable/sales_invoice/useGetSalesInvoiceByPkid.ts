import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetSalesInvoiceByPkid = (pkid: number) => {
  return useQuery({
    queryKey: ['getSalesInvoiceByPkid', pkid],
    queryFn: async () => {
      if (!pkid) {
        return;
      }
      const { data } = await AxiosService.AxiosServiceAccountReceivable.get(
        `salesInvoice/${pkid}`,
      );
      return data.data;
    },
    enabled: !!pkid,
  });
};
