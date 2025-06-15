import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetOperationByPkid = (pkid: number, enabled = true) => {
  return useQuery({
    queryKey: [pkid],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceManufacturing.get(
        `operation/${pkid}`,
      );
      return data.data;
    },
    enabled: enabled,
  });
};
