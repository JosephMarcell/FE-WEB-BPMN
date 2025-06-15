import { useMutation } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useSoftDeleteResource = () => {
  return useMutation({
    mutationKey: ['deleteResource'],
    mutationFn: async (pkid: number) => {
      const response = await AxiosService.AxiosServiceFixedAsset.put(
        `/resources/${pkid}/soft-delete`,
      );
      return response.data;
    },
  });
};
