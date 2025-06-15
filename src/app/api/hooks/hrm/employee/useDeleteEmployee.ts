import { useMutation } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useDeleteEmployee = () => {
  return useMutation({
    mutationKey: ['deleteEmployee'],
    mutationFn: async (pkid: string | number) => {
      const response = await AxiosService.AxiosServiceHRM.delete(
        `employee/${pkid}`,
      );
      return response.data;
    },
  });
};
