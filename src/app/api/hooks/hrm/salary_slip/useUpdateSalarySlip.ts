import { useMutation } from '@tanstack/react-query';

import { SalarySlipProperty } from '@/helpers/utils/hrm/salary_slip';
import AxiosService from '@/services/axiosService';

interface Update {
  pkid: string | number;
  data: SalarySlipProperty;
}
export const useUpdateSalarySlip = () => {
  return useMutation({
    mutationKey: ['updateSalarySlip'],
    mutationFn: async ({ pkid, data }: Update) => {
      try {
        const response = await AxiosService.AxiosServiceHRM.put(
          `salary_slip/${pkid}`,
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
