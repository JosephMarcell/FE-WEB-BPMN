import { useMutation } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useDeleteDepartment = () => {
  return useMutation({
    mutationKey: ['deleteDepartment'],
    mutationFn: async (pkid: string | number) => {
      const response = await AxiosService.AxiosServiceHRM.delete(
        `department/${pkid}`,
      );
      return response.data;
    },
  });
};
