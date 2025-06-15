import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetUniqueRoutingByItemPkid = () => {
  return useQuery({
    queryKey: ['listRouting'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceManufacturing.get(
        'routing/unique/',
      );

      return data.data;
    },
  });
};
