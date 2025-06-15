import { useMutation } from '@tanstack/react-query';

import { WhiteCollarPayrollClassProperty } from '@/helpers/utils/hrm/white_collar_payroll_class';
import AxiosService from '@/services/axiosService';

export const useCreateWhiteCollarPayrollClass = () => {
  return useMutation({
    mutationKey: ['createWhiteCollarPayrollClass'],
    mutationFn: async (data: WhiteCollarPayrollClassProperty) => {
      const response = await AxiosService.AxiosServiceHRM.post(
        'white_payroll/',
        data,
      );
      return response.data;
    },
  });
};
