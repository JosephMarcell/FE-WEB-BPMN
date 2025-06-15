import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetVariableSalaryTypesByPkid = (pkid: string | number) => {
  return useQuery({
    queryKey: [pkid],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceHRM.get(
        `allowance_name/${pkid}`,
      );
      return data.data;
    },
    enabled: !!pkid,
  });
};
