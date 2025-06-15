import { useMutation } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useHardDeleteBankDisbursement = () => {
  return useMutation({
    mutationKey: ['hardDeleteBankDisbursement'],
    mutationFn: async (pkid: number) => {
      const response = await AxiosService.AxiosServiceCashBank.delete(
        `bankDisbursement/hard/${pkid}`,
      );
      return response.data;
    },
  });
};
