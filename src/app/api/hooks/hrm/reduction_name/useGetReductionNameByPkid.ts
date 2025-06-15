import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetReductionNameByPkid = (pkid: string | number) => {
  return useQuery({
    queryKey: [pkid],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceHRM.get(
        `reduction_name/${pkid}`,
      );
      return data.data;
    },
    enabled: !!pkid,
  });
};
