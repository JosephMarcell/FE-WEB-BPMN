import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetFiscalTypeByPkid = (pkid: number, enabled = true) => {
  return useQuery({
    queryKey: [pkid],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceFixedAsset.get(
        `fiscal_type/${pkid}`,
      );
      return data.data;
    },
    enabled: enabled,
  });
};
