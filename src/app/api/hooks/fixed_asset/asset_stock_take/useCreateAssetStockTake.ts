import { useMutation } from '@tanstack/react-query';

import { AssetStockTakeProperty } from '@/helpers/utils/fixed_asset/asset_stock_take';
import AxiosService from '@/services/axiosService';

export const useCreateAssetStockTake = () => {
  return useMutation({
    mutationKey: ['createAssetStockTake'],
    mutationFn: async (data: AssetStockTakeProperty) => {
      const response = await AxiosService.AxiosServiceFixedAsset.post(
        'asset_stock_take/',
        data,
      );
      return response.data;
    },
  });
};
