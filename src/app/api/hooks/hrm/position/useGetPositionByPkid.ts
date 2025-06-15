import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetPositionByPkid = (pkid: string | number) => {
  return useQuery({
    queryKey: [pkid],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceHRM.get(
        `position/${pkid}`,
      );
      return data.data;
    },
    enabled: !!pkid,
  });
};
