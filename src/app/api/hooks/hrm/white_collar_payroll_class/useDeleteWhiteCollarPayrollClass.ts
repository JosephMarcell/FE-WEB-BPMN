import { useMutation } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useDeleteWhiteCollarPayrollClass = () => {
  return useMutation({
    mutationKey: ['deleteWhiteCollarPayrollClass'],
    mutationFn: async (pkid: string | number) => {
      const response = await AxiosService.AxiosServiceHRM.delete(
        `white_payroll/${pkid}`,
      );
      return response.data;
    },
  });
};
