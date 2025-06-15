import { useMutation } from '@tanstack/react-query';

import { AssetRevaluationProperty } from '@/helpers/utils/fixed_asset/asset_revaluation';
import AxiosService from '@/services/axiosService';

export const useCreateAssetRevaluation = () => {
  return useMutation({
    mutationKey: ['createAssetRevaluation'],
    mutationFn: async (data: AssetRevaluationProperty) => {
      const response = await AxiosService.AxiosServiceFixedAsset.post(
        'asset_revaluation/',
        data,
      );
      return response.data;
    },
  });
};
