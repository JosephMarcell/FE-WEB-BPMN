import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetDepartmentByPkid = (pkid: string | number) => {
  return useQuery({
    queryKey: [pkid],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceHRM.get(
        `department/${pkid}`,
      );
      return data.data;
    },
    enabled: !!pkid,
  });
};
