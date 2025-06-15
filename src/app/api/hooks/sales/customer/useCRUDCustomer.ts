import { useMutation, useQuery } from '@tanstack/react-query';

import { CustomerProperty } from '@/helpers/utils/sales/customer';
import AxiosService from '@/services/axiosService';

export const useGetAllCustomer = () => {
  return useQuery({
    queryKey: ['listCustomers'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceSales.get('customers/');
      return data;
    },
  });
};

export const useCreateCustomer = () => {
  return useMutation({
    mutationKey: ['createCustomer'],
    mutationFn: async (data: CustomerProperty) => {
      const response = await AxiosService.AxiosServiceSales.post(
        'customers/',
        data,
      );
      return response.data;
    },
  });
};
