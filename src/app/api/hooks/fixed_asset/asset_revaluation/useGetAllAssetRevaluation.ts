import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetAllAssetRevaluation = () => {
  return useQuery({
    queryKey: ['listAssetRevaluation'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceFixedAsset.get(
        'asset_revaluation/',
      );
      return data.data;
    },
  });
};
