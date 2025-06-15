import { useMutation } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useDeleteFiscalType = () => {
  return useMutation({
    mutationKey: ['deleteFiscalType'],
    mutationFn: async (pkid: number) => {
      const response = await AxiosService.AxiosServiceFixedAsset.delete(
        `fiscal_type/${pkid}`,
      );
      return response.data;
    },
  });
};
