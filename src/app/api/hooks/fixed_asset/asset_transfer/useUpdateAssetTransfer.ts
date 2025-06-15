import { useMutation } from '@tanstack/react-query';

import { AssetTransferProperty } from '@/helpers/utils/fixed_asset/asset_transfer';
import AxiosService from '@/services/axiosService';
interface Update {
  pkid: number;
  data: AssetTransferProperty;
}
export const useUpdateAssetTransfer = () => {
  return useMutation({
    mutationKey: ['updateAssetTransferByPkid'],
    mutationFn: async ({ pkid, data }: Update) => {
      const response = await AxiosService.AxiosServiceFixedAsset.put(
        `asset_transfer/${pkid}`,
        data,
      );
      return response.data;
    },
  });
};
