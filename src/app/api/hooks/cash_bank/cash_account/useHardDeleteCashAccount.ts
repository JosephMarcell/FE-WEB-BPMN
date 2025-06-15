import { useMutation } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useHardDeleteCashAccount = () => {
  return useMutation({
    mutationKey: ['hardDeleteCashAccount'],
    mutationFn: async (pkid: number) => {
      const response = await AxiosService.AxiosServiceCashBank.delete(
        `cashAccount/hard/${pkid}`,
      );
      return response.data;
    },
  });
};
