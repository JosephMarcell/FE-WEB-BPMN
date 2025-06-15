import { useMutation } from '@tanstack/react-query';

import { DepartmentProperty } from '@/helpers/utils/hrm/department';
import AxiosService from '@/services/axiosService';

export const useCreateDepartment = () => {
  return useMutation({
    mutationKey: ['createDepartment'],
    mutationFn: async (data: DepartmentProperty) => {
      const response = await AxiosService.AxiosServiceHRM.post(
        'department/',
        data,
      );
      return response.data;
    },
  });
};
