import { useMutation } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useDeleteAssetRevaluation = () => {
  return useMutation({
    mutationKey: ['deleteAssetRevaluation'],
    mutationFn: async (pkid: number) => {
      const response = await AxiosService.AxiosServiceFixedAsset.delete(
        `asset_revaluation/${pkid}`,
      );
      return response.data;
    },
  });
};
