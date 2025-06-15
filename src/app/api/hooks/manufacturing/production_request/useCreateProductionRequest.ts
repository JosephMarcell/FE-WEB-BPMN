import { useMutation } from '@tanstack/react-query';

import { ProductionRequestProperty } from '@/helpers/utils/manufacturing/production_request';
import AxiosService from '@/services/axiosService';

export const useCreateProductionRequest = () => {
  return useMutation({
    mutationKey: ['createProductionRequest'],
    mutationFn: async (data: ProductionRequestProperty) => {
      const response = await AxiosService.AxiosServiceManufacturing.post(
        'production_request/',
        data,
      );
      return response.data;
    },
  });
};
