import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetCoaByPkid = (pkid: number, enabled = true) => {
  return useQuery({
    queryKey: [pkid],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceGeneralLedger.get(
        `coa/${pkid}`,
      );
      return data.data;
    },
    enabled: enabled,
  });
};
