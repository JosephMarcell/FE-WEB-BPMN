import { useMutation } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useDeleteItem = () => {
  return useMutation({
    mutationKey: ['deleteItem'],
    mutationFn: async (pkid: string | number) => {
      const response = await AxiosService.AxiosServiceInventory.delete(
        `item/hard/${pkid}`,
      );
      return response.data;
    },
  });
};
