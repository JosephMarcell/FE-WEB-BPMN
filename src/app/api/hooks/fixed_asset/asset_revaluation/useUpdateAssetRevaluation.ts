import { useMutation } from '@tanstack/react-query';

import { AssetRevaluationProperty } from '@/helpers/utils/fixed_asset/asset_revaluation';
import AxiosService from '@/services/axiosService';
interface Update {
  pkid: number;
  data: AssetRevaluationProperty;
}
export const useUpdateAssetRevaluation = () => {
  return useMutation({
    mutationKey: ['updateAssetRevaluationByPkid'],
    mutationFn: async ({ pkid, data }: Update) => {
      const response = await AxiosService.AxiosServiceFixedAsset.put(
        `asset_revaluation/${pkid}`,
        data,
      );
      return response.data;
    },
  });
};
