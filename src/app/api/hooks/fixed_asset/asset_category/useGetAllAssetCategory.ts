import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetAllAssetCategory = () => {
  return useQuery({
    queryKey: ['listAssetCategory'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceFixedAsset.get(
        'asset_category/',
      );
      return data.data;
    },
  });
};
