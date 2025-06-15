import { useMutation } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useDeleteReductionName = () => {
  return useMutation({
    mutationKey: ['deleteReductionName'],
    mutationFn: async (pkid: string | number) => {
      const response = await AxiosService.AxiosServiceHRM.delete(
        `reduction_name/${pkid}`,
      );
      return response.data;
    },
  });
};
