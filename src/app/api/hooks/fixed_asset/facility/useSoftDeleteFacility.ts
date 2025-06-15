import { useMutation } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useSoftDeleteFacility = () => {
  return useMutation({
    mutationKey: ['deleteFacility'],
    mutationFn: async (pkid: number) => {
      const response = await AxiosService.AxiosServiceFixedAsset.put(
        `/facilities/${pkid}/soft-delete`,
      );
      return response.data;
    },
  });
};
