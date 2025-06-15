import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetOvertimeByPkid = (pkid: string | number) => {
  return useQuery({
    queryKey: [pkid],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceHRM.get(
        `overtime/${pkid}`,
      );
      return data.data;
    },
    enabled: !!pkid,
  });
};
