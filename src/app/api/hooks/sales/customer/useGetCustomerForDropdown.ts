import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetCustomerForDropdown = () => {
  return useQuery({
    queryKey: ['listCustomerForDropdown'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceSales.get(
        'customer/dropdown',
      );
      return data.data;
    },
  });
};
