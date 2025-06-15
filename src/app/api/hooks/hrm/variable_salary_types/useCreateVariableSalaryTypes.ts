import { useMutation } from '@tanstack/react-query';

import { VariableSalaryTypesProperty } from '@/helpers/utils/hrm/variable_salary_types';
import AxiosService from '@/services/axiosService';

export const useCreateVariableSalaryTypes = () => {
  return useMutation({
    mutationKey: ['createVariableSalaryTypes'],
    mutationFn: async (data: VariableSalaryTypesProperty) => {
      const response = await AxiosService.AxiosServiceHRM.post(
        'allowance_name/',
        data,
      );
      return response.data;
    },
  });
};
