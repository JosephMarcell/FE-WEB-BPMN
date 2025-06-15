import { useMutation } from '@tanstack/react-query';

import { ProductionOrderProperty } from '@/helpers/utils/manufacturing/production_order';
import AxiosService from '@/services/axiosService';

export const useCreateProductionOrder = () => {
  return useMutation({
    mutationKey: ['createProductionOrder'],
    mutationFn: async (data: ProductionOrderProperty) => {
      const response = await AxiosService.AxiosServiceManufacturing.post(
        'production_order/',
        data,
      );
      return response.data;
    },
  });
};
