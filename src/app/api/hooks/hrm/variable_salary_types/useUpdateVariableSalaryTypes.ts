import { useMutation } from '@tanstack/react-query';

import { VariableSalaryTypesProperty } from '@/helpers/utils/hrm/variable_salary_types';
import AxiosService from '@/services/axiosService';
interface Update {
  pkid: string | number;
  data: VariableSalaryTypesProperty;
}
export const useUpdateVariableSalaryTypes = () => {
  return useMutation({
    mutationKey: ['updateVariableSalaryTypesByPkid'],
    mutationFn: async ({ pkid, data }: Update) => {
      try {
        const response = await AxiosService.AxiosServiceHRM.put(
          `allowance_name/${pkid}`,
          data,
        );
        return response.data;
      } catch (error) {
        // Handle the error here
        // throw error;
      }
    },
  });
};
