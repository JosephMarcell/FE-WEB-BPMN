import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetEmployeeByPkid = (pkid: string | number) => {
  return useQuery({
    queryKey: [pkid],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceHRM.get(
        `employee/${pkid}`,
      );
      return data.data;
    },
    enabled: !!pkid,
  });
};
