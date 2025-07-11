import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetFacilityById = (pkid: number, enabled = true) => {
  return useQuery({
    queryKey: [pkid],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceFixedAsset.get(
        `/facilities/${pkid}`,
      );
      return data.data;
    },
    enabled: enabled,
  });
};
