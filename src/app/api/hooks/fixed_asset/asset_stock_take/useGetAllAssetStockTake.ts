import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetAllAssetStockTake = () => {
  return useQuery({
    queryKey: ['listAssetStockTake'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceFixedAsset.get(
        'asset_stock_take/',
      );
      return data.data;
    },
  });
};
