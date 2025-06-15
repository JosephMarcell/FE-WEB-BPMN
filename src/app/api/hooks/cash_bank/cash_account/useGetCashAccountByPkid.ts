import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetCashAccountByPkid = (pkid: number) => {
  return useQuery({
    queryKey: ['getCashAccountByPkid', pkid],
    queryFn: async () => {
      if (!pkid) {
        return;
      }
      const { data } = await AxiosService.AxiosServiceCashBank.get(
        `cashAccount/${pkid}`,
      );
      return data.data;
    },
    enabled: !!pkid,
  });
};
