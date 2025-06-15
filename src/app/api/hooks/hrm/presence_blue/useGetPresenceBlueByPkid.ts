import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetPresenceBlueByPkid = (pkid: string | number) => {
  return useQuery({
    queryKey: [pkid],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceHRM.get(
        `presence_blue/${pkid}`,
      );
      return data.data;
    },
    enabled: !!pkid,
  });
};
