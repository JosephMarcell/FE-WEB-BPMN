import { useMutation } from '@tanstack/react-query';

import { WhiteCollarPayrollClassProperty } from '@/helpers/utils/hrm/white_collar_payroll_class';
import AxiosService from '@/services/axiosService';
interface Update {
  pkid: string | number;
  data: WhiteCollarPayrollClassProperty;
}
export const useUpdateWhiteCollarPayrollClass = () => {
  return useMutation({
    mutationKey: ['updateWhiteCollarPayrollClassByPkid'],
    mutationFn: async ({ pkid, data }: Update) => {
      try {
        const response = await AxiosService.AxiosServiceHRM.put(
          `white_payroll/${pkid}`,
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
