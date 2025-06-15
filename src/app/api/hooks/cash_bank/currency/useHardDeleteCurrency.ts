import { useMutation } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useHardDeleteCurrency = () => {
  return useMutation({
    mutationKey: ['hardDeleteCurrency'],
    mutationFn: async (pkid: number) => {
      const response = await AxiosService.AxiosServiceGeneralSystem.delete(
        `currency/hard/${pkid}`,
      );
      return response.data;
    },
  });
};
