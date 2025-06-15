import { useMutation } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useHardDeleteBankReceipt = () => {
  return useMutation({
    mutationKey: ['hardDeleteBankReceipt'],
    mutationFn: async (pkid: number) => {
      const response = await AxiosService.AxiosServiceCashBank.delete(
        `bankReceipt/hard/${pkid}`,
      );
      return response.data;
    },
  });
};
