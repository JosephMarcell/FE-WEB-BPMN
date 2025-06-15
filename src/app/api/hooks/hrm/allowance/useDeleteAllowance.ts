import { useMutation } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

interface Delete {
  data: number[];
}

export const useDeleteAllowance = () => {
  return useMutation({
    mutationKey: ['deleteAllowance'],
    mutationFn: async ({ data }: Delete) => {
      const response = await AxiosService.AxiosServiceHRM.delete('allowance/', {
        data: data,
      });
      return response.data;
    },
  });
};
