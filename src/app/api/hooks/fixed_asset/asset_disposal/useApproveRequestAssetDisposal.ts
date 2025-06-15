import { useMutation } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useApproveRequestAssetDisposal = () => {
  return useMutation({
    mutationKey: ['approveRequestAssetDisposal'],
    mutationFn: async (pkid: number) => {
      const response = await AxiosService.AxiosServiceFixedAsset.put(
        `asset_disposal/approve/${pkid}`,
      );
      return response.data;
    },
  });
};
