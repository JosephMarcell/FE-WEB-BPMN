import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetPresenceWhiteByPkid = (pkid: string | number) => {
  return useQuery({
    queryKey: [pkid],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceHRM.get(
        `presence_white/${pkid}`,
      );
      return data.data;
    },
    enabled: !!pkid,
  });
};
