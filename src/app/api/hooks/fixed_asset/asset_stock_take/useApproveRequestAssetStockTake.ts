import { useMutation } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useApproveRequestAssetStockTake = () => {
  return useMutation({
    mutationKey: ['approveRequestAssetStockTake'],
    mutationFn: async (pkid: number) => {
      const response = await AxiosService.AxiosServiceFixedAsset.put(
        `asset_stock_take/approve/${pkid}`,
      );
      return response.data;
    },
  });
};
