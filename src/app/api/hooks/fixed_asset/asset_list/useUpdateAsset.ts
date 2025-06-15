import { useMutation } from '@tanstack/react-query';

import { AssetListProperty } from '@/helpers/utils/fixed_asset/asset_list';
import AxiosService from '@/services/axiosService';
interface Update {
  pkid: number;
  data: AssetListProperty;
}
export const useUpdateAsset = () => {
  return useMutation({
    mutationKey: ['updateAssetByPkid'],
    mutationFn: async ({ pkid, data }: Update) => {
      const response = await AxiosService.AxiosServiceFixedAsset.put(
        `/assets/${pkid}`,
        data,
      );
      return response.data;
    },
  });
};
