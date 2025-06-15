import { useMutation } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useDeleteAssetDisposal = () => {
  return useMutation({
    mutationKey: ['deleteAssetDisposal'],
    mutationFn: async (pkid: number) => {
      const response = await AxiosService.AxiosServiceFixedAsset.delete(
        `asset_disposal/${pkid}`,
      );
      return response.data;
    },
  });
};
