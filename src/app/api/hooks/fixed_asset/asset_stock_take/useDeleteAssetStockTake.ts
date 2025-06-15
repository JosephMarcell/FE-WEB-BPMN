import { useMutation } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useDeleteAssetStockTake = () => {
  return useMutation({
    mutationKey: ['deleteAssetStockTake'],
    mutationFn: async (pkid: number) => {
      const response = await AxiosService.AxiosServiceFixedAsset.delete(
        `asset_stock_take/${pkid}`,
      );
      return response.data;
    },
  });
};
