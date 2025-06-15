import { useMutation } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useHardDeleteCashReceipt = () => {
  return useMutation({
    mutationKey: ['hardDeleteCashReceipt'],
    mutationFn: async (pkid: number) => {
      const response = await AxiosService.AxiosServiceCashBank.delete(
        `cashReceipt/hard/${pkid}`,
      );
      return response.data;
    },
  });
};
