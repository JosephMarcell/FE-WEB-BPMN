import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetAllAssetTransfer = () => {
  return useQuery({
    queryKey: ['listAssetTransfer'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceFixedAsset.get(
        'asset_transfer/',
      );
      return data.data;
    },
  });
};
