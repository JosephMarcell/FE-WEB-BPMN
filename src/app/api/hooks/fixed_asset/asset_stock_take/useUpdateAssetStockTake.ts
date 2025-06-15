import { useMutation } from '@tanstack/react-query';

import { AssetStockTakeProperty } from '@/helpers/utils/fixed_asset/asset_stock_take';
import AxiosService from '@/services/axiosService';
interface Update {
  pkid: number;
  data: AssetStockTakeProperty;
}
export const useUpdateAssetStockTake = () => {
  return useMutation({
    mutationKey: ['updateAssetStockTakeByPkid'],
    mutationFn: async ({ pkid, data }: Update) => {
      const response = await AxiosService.AxiosServiceFixedAsset.put(
        `asset_stock_take/${pkid}`,
        data,
      );
      return response.data;
    },
  });
};
