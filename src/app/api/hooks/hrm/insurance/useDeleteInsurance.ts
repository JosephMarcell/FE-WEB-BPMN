import { useMutation } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useDeleteInsurance = () => {
  return useMutation({
    mutationKey: ['deleteInsurance'],
    mutationFn: async (pkid: string | number) => {
      const response = await AxiosService.AxiosServiceHRM.delete(
        `asuransi/${pkid}`,
      );
      return response.data;
    },
  });
};
