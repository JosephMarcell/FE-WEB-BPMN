import { useMutation } from '@tanstack/react-query';

import { SalaryPercentageProperty } from '@/helpers/utils/hrm/salary_percentage';
import AxiosService from '@/services/axiosService';

interface Update {
  pkid: number;
  data: SalaryPercentageProperty;
}

export const useUpdateSalaryPercentage = () => {
  return useMutation({
    mutationKey: ['updateSalaryPercentageByPkid'],
    mutationFn: async ({ pkid, data }: Update) => {
      const response = await AxiosService.AxiosServiceHRM.put(
        `salary_percentage/${pkid}`,
        data,
      );
      return response.data;
    },
  });
};
