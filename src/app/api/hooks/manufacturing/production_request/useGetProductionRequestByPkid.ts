import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetProductionRequestByPkid = (pkid: number, enabled = true) => {
  return useQuery({
    queryKey: [pkid],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceManufacturing.get(
        `production_request/${pkid}`,
      );
      return data.data;
    },
    enabled: enabled,
  });
};
