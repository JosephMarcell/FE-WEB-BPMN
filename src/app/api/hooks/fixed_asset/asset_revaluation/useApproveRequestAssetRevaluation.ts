import { useMutation } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useApproveRequestAssetRevaluation = () => {
  return useMutation({
    mutationKey: ['approveRequestAssetRevaluation'],
    mutationFn: async (pkid: number) => {
      const response = await AxiosService.AxiosServiceFixedAsset.put(
        `asset_revaluation/approve/${pkid}`,
      );
      return response.data;
    },
  });
};
