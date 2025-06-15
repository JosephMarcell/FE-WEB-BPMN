import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetAllSalesOrder = () => {
  return useQuery({
    queryKey: ['listSalesOrder'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceSales.get('salesOrder/');
      return data.data;
    },
  });
};
