import { useMutation } from '@tanstack/react-query';

import { InspectionProductProperty } from '@/helpers/utils/manufacturing/inspection_product';
import AxiosService from '@/services/axiosService';

export const useCreateInspectionProduct = () => {
  return useMutation({
    mutationKey: ['createInspectionProduct'],
    mutationFn: async (data: InspectionProductProperty) => {
      const response = await AxiosService.AxiosServiceManufacturing.post(
        'inspection_product/',
        data,
      );
      return response.data;
    },
  });
};
