import { useMutation } from '@tanstack/react-query';

import { SalesOrderProperty } from '@/helpers/utils/sales/sales';
import AxiosService from '@/services/axiosService';

export const useCreateSalesOrder = () => {
  return useMutation({
    mutationKey: ['createSalesOrder'],
    mutationFn: async (data: SalesOrderProperty) => {
      const response = await AxiosService.AxiosServiceSales.post(
        'customer/',
        data,
      );
      return response.data;
    },
  });
};
