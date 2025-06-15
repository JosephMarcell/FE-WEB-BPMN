import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetCashDisbursementByPkid = (pkid: number) => {
  return useQuery({
    queryKey: ['getCashDisbursementByPkid', pkid],
    queryFn: async () => {
      if (!pkid) {
        return;
      }
      const { data } = await AxiosService.AxiosServiceCashBank.get(
        `cashDisbursement/${pkid}`,
      );
      return data.data.result;
    },
    enabled: !!pkid,
  });
};
