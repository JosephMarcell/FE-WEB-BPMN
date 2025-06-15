import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetBankAccountByPkid = (pkid: number) => {
  return useQuery({
    queryKey: ['getBankAccountByPkid', pkid],
    queryFn: async () => {
      if (!pkid) {
        return;
      }
      const { data } = await AxiosService.AxiosServiceCashBank.get(
        `bankAccount/${pkid}`,
      );
      return data.data;
    },
    enabled: !!pkid,
  });
};
