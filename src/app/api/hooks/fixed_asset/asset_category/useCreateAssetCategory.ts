import { useMutation } from '@tanstack/react-query';

import { AssetCategoryProperty } from '@/helpers/utils/fixed_asset/asset_category';
import AxiosService from '@/services/axiosService';

export const useCreateAssetCategory = () => {
  return useMutation({
    mutationKey: ['createAssetCategory'],
    mutationFn: async (data: AssetCategoryProperty) => {
      const response = await AxiosService.AxiosServiceFixedAsset.post(
        'asset_category/',
        data,
      );
      return response.data;
    },
  });
};
