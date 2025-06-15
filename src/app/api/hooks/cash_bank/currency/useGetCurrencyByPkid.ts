import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetCurrencyByPkid = (pkid: number) => {
  return useQuery({
    queryKey: ['getCurrencyByPkid', pkid],
    queryFn: async () => {
      if (!pkid) {
        return;
      }
      const { data } = await AxiosService.AxiosServiceGeneralSystem.get(
        `currency/${pkid}`,
      );
      return data.data;
    },
    enabled: !!pkid,
  });
};
