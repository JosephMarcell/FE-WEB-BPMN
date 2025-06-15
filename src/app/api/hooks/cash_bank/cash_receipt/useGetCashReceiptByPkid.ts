import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetCashReceiptByPkid = (pkid: number) => {
  return useQuery({
    queryKey: ['getCashReceiptByPkid', pkid],
    queryFn: async () => {
      if (!pkid) {
        return;
      }
      const { data } = await AxiosService.AxiosServiceCashBank.get(
        `cashReceipt/${pkid}`,
      );
      return data.data.result;
    },
    enabled: !!pkid,
  });
};
