import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetAllNumberGroup = () => {
  return useQuery({
    queryKey: ['listNumberGroup'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceFixedAsset.get(
        'asset_number_group/',
      );
      return data.data;
    },
  });
};
