import { useMutation } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useDeleteItemWarehouse = () => {
  return useMutation({
    mutationKey: ['deleteItemWarehouse'],
    mutationFn: async (pkid: string | number) => {
      const response = await AxiosService.AxiosServiceInventory.delete(
        `itemWarehouse/hard/${pkid}`,
      );
      return response.data;
    },
  });
};
