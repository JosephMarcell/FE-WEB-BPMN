import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetBankReceiptByPkid = (pkid: number) => {
  return useQuery({
    queryKey: ['getBankReceiptByPkid', pkid],
    queryFn: async () => {
      if (!pkid) {
        return;
      }
      const { data } = await AxiosService.AxiosServiceCashBank.get(
        `bankReceipt/${pkid}`,
      );
      return data.data.result;
    },
    enabled: !!pkid,
  });
};
