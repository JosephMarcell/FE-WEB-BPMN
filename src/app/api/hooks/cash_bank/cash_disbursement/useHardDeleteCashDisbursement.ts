import { useMutation } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useHardDeleteCashDisbursement = () => {
  return useMutation({
    mutationKey: ['hardDeleteCashDisbursement'],
    mutationFn: async (pkid: number) => {
      const response = await AxiosService.AxiosServiceCashBank.delete(
        `cashDisbursement/hard/${pkid}`,
      );
      return response.data;
    },
  });
};
