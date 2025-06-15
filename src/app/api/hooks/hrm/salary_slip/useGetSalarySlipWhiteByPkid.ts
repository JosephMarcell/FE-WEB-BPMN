import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetSalarySlipWhiteByPkid = (pkid: number) => {
  return useQuery({
    queryKey: [pkid],
    queryFn: async () => {
      const { data, headers } = await AxiosService.AxiosServiceHRM.get(
        `salary_slip/slip_white/${pkid}`,
      );
      return { data: data.data, headers };
    },
    enabled: !!pkid,
  });
};
