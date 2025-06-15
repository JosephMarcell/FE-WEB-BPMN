import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetSalarySlipBlueByPkid = (
  pkid: number,
  tunjangan_lain: number,
  pengurangan_lain: number,
) => {
  return useQuery({
    queryKey: [pkid],
    queryFn: async () => {
      const { data, headers } = await AxiosService.AxiosServiceHRM.get(
        `salary_slip/slip_blue/${pkid}/${tunjangan_lain}/${pengurangan_lain}`,
      );
      return { data: data.data, headers };
    },
    enabled: !!pkid,
  });
};
