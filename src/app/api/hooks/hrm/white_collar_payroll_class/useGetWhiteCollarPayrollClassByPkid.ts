import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetWhiteCollarPayrollClassByPkid = (pkid: string | number) => {
  return useQuery({
    queryKey: [pkid],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceHRM.get(
        `white_payroll/${pkid}`,
      );
      return data.data;
    },
    enabled: !!pkid,
  });
};
