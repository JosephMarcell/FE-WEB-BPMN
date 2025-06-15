import { useMutation } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useDeleteAssetCategory = () => {
  return useMutation({
    mutationKey: ['deleteAssetCategory'],
    mutationFn: async (pkid: number) => {
      const response = await AxiosService.AxiosServiceFixedAsset.delete(
        `asset_category/${pkid}`,
      );
      return response.data;
    },
  });
};
