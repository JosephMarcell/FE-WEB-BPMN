import { useMutation } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useDeleteWarehouse = () => {
  return useMutation({
    mutationKey: ['deleteWarehouse'],
    mutationFn: async (pkid: string | number) => {
      const response = await AxiosService.AxiosServiceInventory.delete(
        `warehouse/hard/${pkid}`,
      );
      return response.data;
    },
  });
};
