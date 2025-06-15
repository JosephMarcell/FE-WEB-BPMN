import { useMutation } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useDeleteVariableSalaryTypes = () => {
  return useMutation({
    mutationKey: ['deleteVariableSalaryTypes'],
    mutationFn: async (pkid: string | number) => {
      const response = await AxiosService.AxiosServiceHRM.delete(
        `allowance_name/${pkid}`,
      );
      return response.data;
    },
  });
};
