import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetManByPkid = (pkid: number, enabled = true) => {
  return useQuery({
    queryKey: [pkid],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceManufacturing.get(
        `man_skill/${pkid}`,
      );
      return data.data;
    },
    enabled: enabled,
  });
};
