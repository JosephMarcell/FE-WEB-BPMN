import { useMutation } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useDeleteInventoryReceive = () => {
  return useMutation({
    mutationKey: ['deleteInventoryReceive'],
    mutationFn: async (pkid: number) => {
      const response = await AxiosService.AxiosServiceInventory.delete(
        `receive/hard/${pkid}`,
      );
      return response.data;
    },
  });
};
