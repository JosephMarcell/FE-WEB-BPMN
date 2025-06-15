import { useMutation } from '@tanstack/react-query';

import { CountSalarySlipWhiteInput } from '@/helpers/utils/hrm/salary_slip';
import AxiosService from '@/services/axiosService';

export const useCountSalarySlipWhite = () => {
  return useMutation({
    mutationKey: ['countSalarySlipWhite'],
    mutationFn: async (data: CountSalarySlipWhiteInput) => {
      const response = await AxiosService.AxiosServiceHRM.post(
        'salary_slip/count_white/',
        data,
      );
      return response.data;
    },
  });
};
