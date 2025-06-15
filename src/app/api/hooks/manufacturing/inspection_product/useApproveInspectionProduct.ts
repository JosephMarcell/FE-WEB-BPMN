import { useMutation } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useApproveInspectionProduct = () => {
  return useMutation({
    mutationKey: ['approveInspectionProduct'],
    mutationFn: async (pkid: number) => {
      const response = await AxiosService.AxiosServiceManufacturing.put(
        `inspection_product/approve/${pkid}`,
      );
      return response.data;
    },
  });
};
