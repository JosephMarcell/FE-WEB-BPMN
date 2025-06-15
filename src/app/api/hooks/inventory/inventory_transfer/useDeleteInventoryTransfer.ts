import { useMutation } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useDeleteInventoryTransfer = () => {
  return useMutation({
    mutationKey: ['deleteInventoryTransfer'],
    mutationFn: async (pkid: number) => {
      const response = await AxiosService.AxiosServiceInventory.delete(
        `transfer/hard/${pkid}`,
      );
      return response.data;
    },
  });
};
