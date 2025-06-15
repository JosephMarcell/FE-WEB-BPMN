import { useMutation } from '@tanstack/react-query';

import { SupplierProperty } from '@/helpers/utils/purchasing/supplier';
import AxiosService from '@/services/axiosService';

export const useCreateSupplier = () => {
  return useMutation({
    mutationKey: ['createSupplier'],
    mutationFn: async (data: SupplierProperty) => {
      const response = await AxiosService.AxiosServicePurchasing.post(
        'supplier/',
        data,
      );
      return response.data;
    },
  });
};
