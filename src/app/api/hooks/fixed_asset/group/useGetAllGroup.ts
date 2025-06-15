import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetAllGroup = () => {
  return useQuery({
    queryKey: ['listGroup'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceFixedAsset.get(
        'asset_group/',
      );
      return data.data;
    },
  });
};
