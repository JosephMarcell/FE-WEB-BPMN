import { useMutation } from '@tanstack/react-query';

import { EmployeeProperty } from '@/helpers/utils/hrm/employee';
import AxiosService from '@/services/axiosService';
interface Update {
  pkid: string | number;
  data: EmployeeProperty;
}
export const useUpdateEmployee = () => {
  return useMutation({
    mutationKey: ['updateEmployeeByPkid'],
    mutationFn: async ({ pkid, data }: Update) => {
      const response = await AxiosService.AxiosServiceHRM.put(
        `employee/${pkid}`,
        data,
      );
      return response.data;
    },
  });
};
