import { useMutation } from '@tanstack/react-query';

import { OperationProperty } from '@/helpers/utils/manufacturing/operation';
import AxiosService from '@/services/axiosService';
export const useCreateOperation = () => {
  return useMutation({
    mutationKey: ['createOperation'],
    mutationFn: async (data: OperationProperty) => {
      const response = await AxiosService.AxiosServiceManufacturing.post(
        'operation/',
        data,
      );
      return response.data;
    },
  });
};
