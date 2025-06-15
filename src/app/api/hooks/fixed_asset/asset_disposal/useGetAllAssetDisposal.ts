import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetAllAssetDisposal = () => {
  return useQuery({
    queryKey: ['listAssetDisposal'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceFixedAsset.get(
        'asset_disposal/',
      );
      return data.data;
    },
  });
};
