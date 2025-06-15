import { useMutation } from '@tanstack/react-query';

import { DepartmentProperty } from '@/helpers/utils/hrm/department';
import AxiosService from '@/services/axiosService';
interface Update {
  pkid: string | number;
  data: DepartmentProperty;
}
export const useUpdateDepartment = () => {
  return useMutation({
    mutationKey: ['updateDepartmentByPkid'],
    mutationFn: async ({ pkid, data }: Update) => {
      const response = await AxiosService.AxiosServiceHRM.put(
        `department/${pkid}`,
        data,
      );
      return response.data;
    },
  });
};
