import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetInsuranceByPkid = (pkid: string | number) => {
  return useQuery({
    queryKey: [pkid],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceHRM.get(
        `asuransi/${pkid}`,
      );
      return data.data;
    },
    enabled: !!pkid,
  });
};
