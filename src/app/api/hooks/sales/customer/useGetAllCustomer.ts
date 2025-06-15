import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetAllCustomer = () => {
  return useQuery({
    queryKey: ['listCustomer'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceSales.get('customer/');
      return data.data;
    },
  });
};
