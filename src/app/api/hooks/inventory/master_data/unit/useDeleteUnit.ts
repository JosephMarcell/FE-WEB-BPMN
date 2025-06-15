import { useMutation } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useDeleteUnit = () => {
  return useMutation({
    mutationKey: ['deleteUnit'],
    mutationFn: async (pkid: string | number) => {
      const response = await AxiosService.AxiosServiceInventory.delete(
        `unit/hard/${pkid}`,
      );
      return response.data;
    },
  });
};
