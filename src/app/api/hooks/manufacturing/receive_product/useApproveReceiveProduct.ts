import { useMutation } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useApproveReceiveProduct = () => {
  return useMutation({
    mutationKey: ['approveReceiveProduct'],
    mutationFn: async (pkid: number) => {
      const response = await AxiosService.AxiosServiceManufacturing.put(
        `receive_product/approve/${pkid}`,
      );
      return response.data;
    },
  });
};
