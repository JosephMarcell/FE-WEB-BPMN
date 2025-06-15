import { useMutation } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useApproveRequestAssetTransfer = () => {
  return useMutation({
    mutationKey: ['approveRequestAssetTransfer'],
    mutationFn: async (pkid: number) => {
      const response = await AxiosService.AxiosServiceFixedAsset.put(
        `asset_transfer/approve/${pkid}`,
      );
      return response.data;
    },
  });
};
