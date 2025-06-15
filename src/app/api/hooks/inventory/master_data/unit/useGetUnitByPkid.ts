import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetUnitByPkid = (pkid: string | number) => {
  return useQuery({
    queryKey: [pkid],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceInventory.get(
        `unit/${pkid}`,
      );
      return data.data;
    },
  });
};
