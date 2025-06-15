import { useMutation } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetAssetCategoryByPkidTrigger = () => {
  return useMutation({
    mutationKey: ['assetCategoryByPkid'],
    mutationFn: async (pkid: number) => {
      const response = await AxiosService.AxiosServiceFixedAsset.get(
        `asset_category/${pkid}`,
      );
      return response.data;
    },
  });
};
