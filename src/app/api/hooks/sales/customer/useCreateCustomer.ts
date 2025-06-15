import { useMutation } from '@tanstack/react-query';

import { CustomerProperty } from '@/helpers/utils/sales/customer';
import AxiosService from '@/services/axiosService';

export const useCreateCustomer = () => {
  return useMutation({
    mutationKey: ['createCustomer'],
    mutationFn: async (data: CustomerProperty) => {
      const response = await AxiosService.AxiosServiceSales.post(
        'customer/',
        data,
      );
      return response.data;
    },
  });
};
