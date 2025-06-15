import { useMutation } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useDeleteAssetTransfer = () => {
  return useMutation({
    mutationKey: ['deleteAssetTransfer'],
    mutationFn: async (pkid: number) => {
      const response = await AxiosService.AxiosServiceFixedAsset.delete(
        `asset_transfer/${pkid}`,
      );
      return response.data;
    },
  });
};
