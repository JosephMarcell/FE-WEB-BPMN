import { useMutation } from '@tanstack/react-query';

import { AssetCategoryProperty } from '@/helpers/utils/fixed_asset/asset_category';
import AxiosService from '@/services/axiosService';
interface Update {
  pkid: number;
  data: AssetCategoryProperty;
}
export const useUpdateAssetCategory = () => {
  return useMutation({
    mutationKey: ['updateAssetCategoryByPkid'],
    mutationFn: async ({ pkid, data }: Update) => {
      const response = await AxiosService.AxiosServiceFixedAsset.put(
        `asset_category/${pkid}`,
        data,
      );
      return response.data;
    },
  });
};
