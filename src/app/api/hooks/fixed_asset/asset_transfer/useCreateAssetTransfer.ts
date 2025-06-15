import { useMutation } from '@tanstack/react-query';

import { AssetTransferProperty } from '@/helpers/utils/fixed_asset/asset_transfer';
import AxiosService from '@/services/axiosService';

export const useCreateAssetTransfer = () => {
  return useMutation({
    mutationKey: ['createAssetTransfer'],
    mutationFn: async (data: AssetTransferProperty) => {
      const response = await AxiosService.AxiosServiceFixedAsset.post(
        'asset_transfer/',
        data,
      );
      return response.data;
    },
  });
};
