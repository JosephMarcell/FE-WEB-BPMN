import { useMutation } from '@tanstack/react-query';

import { AssetDisposalProperty } from '@/helpers/utils/fixed_asset/asset_disposal';
import AxiosService from '@/services/axiosService';
interface Update {
  pkid: number;
  data: AssetDisposalProperty;
}
export const useUpdateAssetDisposal = () => {
  return useMutation({
    mutationKey: ['updateAssetDisposalByPkid'],
    mutationFn: async ({ pkid, data }: Update) => {
      const response = await AxiosService.AxiosServiceFixedAsset.put(
        `asset_disposal/${pkid}`,
        data,
      );
      return response.data;
    },
  });
};
