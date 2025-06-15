import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetBankDisbursementByPkid = (pkid: number) => {
  return useQuery({
    queryKey: ['getBankDisbursementByPkid', pkid],
    queryFn: async () => {
      if (!pkid) {
        return;
      }
      const { data } = await AxiosService.AxiosServiceCashBank.get(
        `bankDisbursement/${pkid}`,
      );
      return data.data.result;
    },
    enabled: !!pkid,
  });
};
