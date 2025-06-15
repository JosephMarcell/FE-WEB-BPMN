import { useMutation } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useHardDeleteBankAccount = () => {
  return useMutation({
    mutationKey: ['hardDeleteBankAccount'],
    mutationFn: async (pkid: number) => {
      const response = await AxiosService.AxiosServiceCashBank.delete(
        `bankAccount/hard/${pkid}`,
      );
      return response.data;
    },
  });
};
