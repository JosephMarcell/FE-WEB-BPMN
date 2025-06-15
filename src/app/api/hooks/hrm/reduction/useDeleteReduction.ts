import { useMutation } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

interface Delete {
  data: number[];
}

export const useDeleteReduction = () => {
  return useMutation({
    mutationKey: ['deleteReduction'],
    mutationFn: async ({ data }: Delete) => {
      const response = await AxiosService.AxiosServiceHRM.delete('reduction/', {
        data: data,
      });
      return response.data;
    },
  });
};
