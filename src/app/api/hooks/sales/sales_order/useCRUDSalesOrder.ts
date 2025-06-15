import { useMutation, useQuery } from '@tanstack/react-query';

import { NewSalesProperty } from '@/helpers/utils/sales/sales_old';
import AxiosService from '@/services/axiosService';

export const useGetAllSalesOrders = () => {
  return useQuery({
    queryKey: ['listSalesOrder'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceSales.get('sales/');
      return data;
    },
  });
};

export const useCreateSalesOrder = () => {
  return useMutation({
    mutationKey: ['createSalesOrder'],
    mutationFn: async (data: NewSalesProperty) => {
      const response = await AxiosService.AxiosServiceSales.post(
        'sales/',
        data,
      );
      return response.data;
    },
  });
};

export const useGetSalesOrderByCode = (salesCode: string) => {
  return useQuery({
    queryKey: ['getSalesOrderByCode', salesCode],
    queryFn: async () => {
      if (!salesCode) {
        return;
      }
      const { data } = await AxiosService.AxiosServiceSales.get(
        `sales/code/${salesCode}`,
      );
      return data;
    },
    enabled: !!salesCode,
  });
};
