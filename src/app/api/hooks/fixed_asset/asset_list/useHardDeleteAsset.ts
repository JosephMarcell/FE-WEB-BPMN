import { useMutation } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useHardDeleteAsset = () => {
  return useMutation({
    mutationKey: ['deleteAsset'],
    mutationFn: async (pkid: number) => {
      const response = await AxiosService.AxiosServiceFixedAsset.delete(
        `/assets/${pkid}`,
      );
      return response.data;
    },
  });
};
