import { useMutation } from '@tanstack/react-query';

import { AssetDisposalProperty } from '@/helpers/utils/fixed_asset/asset_disposal';
import AxiosService from '@/services/axiosService';

export const useCreateAssetDisposal = () => {
  return useMutation({
    mutationKey: ['createAssetDisposal'],
    mutationFn: async (data: AssetDisposalProperty) => {
      const response = await AxiosService.AxiosServiceFixedAsset.post(
        'asset_disposal/',
        data,
      );
      return response.data;
    },
  });
};
