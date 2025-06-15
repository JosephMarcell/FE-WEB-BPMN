import { useMutation } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useSoftDeleteAsset = () => {
  return useMutation({
    mutationKey: ['deleteAsset'],
    mutationFn: async (pkid: number) => {
      const response = await AxiosService.AxiosServiceFixedAsset.put(
        `/assets/${pkid}/soft-delete`,
      );
      return response.data;
    },
  });
};
